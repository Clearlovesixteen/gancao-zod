import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const packageNames = [
  'zod-core',
  'zod-presets',
  'zod-react-hook-form',
  'zod-express',
  'zod-nestjs',
];

function run(command, args, cwd, env = {}) {
  execFileSync(command, args, {
    cwd,
    env: { ...process.env, ...env },
    stdio: 'pipe',
  });
}

const workDir = await mkdtemp(resolve(tmpdir(), 'gancao-zod-packages-'));
const scopeDir = resolve(workDir, 'node_modules/@clearlovesixteen');

try {
  await mkdir(scopeDir, { recursive: true });

  for (const packageName of packageNames) {
    const workspace = `packages/${packageName}`;

    // dry-run 校验 files、exports 和最终 tarball 内容，不在仓库生成压缩包。
    run('npm', ['pack', '--dry-run', '--workspace', workspace], rootDir, {
      npm_config_cache: resolve(workDir, '.npm-cache'),
    });

    // 通过 node_modules 包名消费构建产物，避免测试只覆盖源码内部路径。
    await symlink(
      resolve(rootDir, workspace),
      resolve(scopeDir, packageName),
      process.platform === 'win32' ? 'junction' : 'dir',
    );
  }

  await writeFile(
    resolve(workDir, 'esm.mjs'),
    `
import { validate, z } from '@clearlovesixteen/zod-core';
import { paginationSchema } from '@clearlovesixteen/zod-presets';
import { gancaoZodResolver } from '@clearlovesixteen/zod-react-hook-form';
import { validateRequest } from '@clearlovesixteen/zod-express';
import { GancaoValidationPipe } from '@clearlovesixteen/zod-nestjs';

if (!validate(z.string(), 'ok').success) throw new Error('ESM core import failed');
if (!paginationSchema.safeParse({}).success) throw new Error('ESM presets import failed');
if (![gancaoZodResolver, validateRequest, GancaoValidationPipe].every(Boolean)) {
  throw new Error('ESM adapter import failed');
}
`,
  );

  await writeFile(
    resolve(workDir, 'commonjs.cjs'),
    `
const { validate, z } = require('@clearlovesixteen/zod-core');
const { paginationSchema } = require('@clearlovesixteen/zod-presets');
const { gancaoZodResolver } = require('@clearlovesixteen/zod-react-hook-form');
const { validateRequest } = require('@clearlovesixteen/zod-express');
const { GancaoValidationPipe } = require('@clearlovesixteen/zod-nestjs');

if (!validate(z.string(), 'ok').success) throw new Error('CJS core require failed');
if (!paginationSchema.safeParse({}).success) throw new Error('CJS presets require failed');
if (![gancaoZodResolver, validateRequest, GancaoValidationPipe].every(Boolean)) {
  throw new Error('CJS adapter require failed');
}
`,
  );

  await writeFile(
    resolve(workDir, 'consumer.ts'),
    `
import { validate, z, type ValidationResult } from '@clearlovesixteen/zod-core';
import { gancaoZodResolver } from '@clearlovesixteen/zod-react-hook-form';

const result: ValidationResult<string> = validate(z.string(), 'ok');
const resolver = gancaoZodResolver(z.object({ name: z.string() }));
void result;
void resolver;
`,
  );

  run(process.execPath, ['esm.mjs'], workDir);
  run(process.execPath, ['commonjs.cjs'], workDir);
  run(
    process.execPath,
    [
      resolve(rootDir, 'node_modules/typescript/bin/tsc'),
      '--noEmit',
      '--strict',
      '--skipLibCheck',
      '--target',
      'ES2022',
      '--module',
      'NodeNext',
      '--moduleResolution',
      'NodeNext',
      'consumer.ts',
    ],
    workDir,
  );

  console.log('Package consumption checks passed (ESM, CommonJS, TypeScript).');
} finally {
  await rm(workDir, { recursive: true, force: true });
}
