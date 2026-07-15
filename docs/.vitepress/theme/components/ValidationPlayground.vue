<script setup lang="ts">
import { computed, ref } from 'vue';
import type { FieldValues, ResolverOptions } from 'react-hook-form';
import type { z } from 'zod';

import { gancaoZodResolver } from '@clearlovesixteen/zod-react-hook-form';
import { emailSchema, phoneSchema } from '@clearlovesixteen/zod-presets';
import { z as gancaoZ } from '@clearlovesixteen/zod-core';

type Locale = 'zh-CN' | 'en-US';
type CriteriaMode = 'firstError' | 'all';
type ScenarioKey = 'profile' | 'password' | 'members' | 'async';

interface Scenario {
  label: string;
  schema: z.ZodType;
  valid: FieldValues;
  invalid: FieldValues;
}

const scenarios: Record<ScenarioKey, Scenario> = {
  profile: {
    label: '资料转换',
    schema: gancaoZ.object({
      name: gancaoZ.string().trim().min(1),
      email: emailSchema,
      age: gancaoZ.coerce.number().int().min(18),
      phone: phoneSchema,
    }),
    valid: {
      name: '  Ada  ',
      email: 'ADA@EXAMPLE.COM',
      age: '36',
      phone: '13800138000',
    },
    invalid: {
      name: '',
      email: 'not-an-email',
      age: 'unknown',
      phone: '10086',
    },
  },
  password: {
    label: '全部错误',
    schema: gancaoZ.object({
      password: gancaoZ.string().min(8).regex(/[A-Z]/),
    }),
    valid: { password: 'Gancao2026' },
    invalid: { password: 'short' },
  },
  members: {
    label: '嵌套字段',
    schema: gancaoZ.object({
      members: gancaoZ.array(
        gancaoZ.object({
          name: gancaoZ.string().trim().min(1),
          email: emailSchema,
        }),
      ),
    }),
    valid: {
      members: [
        { name: 'Ada', email: 'ada@example.com' },
        { name: 'Lin', email: 'LIN@EXAMPLE.COM' },
      ],
    },
    invalid: {
      members: [
        { name: '', email: 'invalid' },
        { name: 'Lin', email: 'also-invalid' },
      ],
    },
  },
  async: {
    label: '异步规则',
    schema: gancaoZ.object({
      username: gancaoZ
        .string()
        .trim()
        .min(3)
        .refine(
          async (value) => {
            await Promise.resolve();
            return value.toLowerCase() !== 'admin';
          },
          { message: '该用户名已被占用' },
        ),
    }),
    valid: { username: 'gancao-user' },
    invalid: { username: 'admin' },
  },
};

const scenarioKey = ref<ScenarioKey>('profile');
const locale = ref<Locale>('zh-CN');
const criteriaMode = ref<CriteriaMode>('firstError');
const input = ref('');
const output = ref('');
const status = ref<'idle' | 'running' | 'success' | 'failure'>('idle');

const currentScenario = computed(() => scenarios[scenarioKey.value]);
const statusLabel = computed(() => {
  if (status.value === 'running') return '校验中';
  if (status.value === 'success') return '校验通过';
  if (status.value === 'failure') return '校验失败';
  return '等待运行';
});

function resolverOptions(): ResolverOptions<FieldValues> {
  return {
    criteriaMode: criteriaMode.value,
    fields: {},
    shouldUseNativeValidation: false,
  };
}

function setInput(kind: 'valid' | 'invalid'): void {
  input.value = JSON.stringify(currentScenario.value[kind], null, 2);
  void runValidation();
}

function selectScenario(key: ScenarioKey): void {
  scenarioKey.value = key;
  setInput('invalid');
}

async function runValidation(): Promise<void> {
  status.value = 'running';

  try {
    const values = JSON.parse(input.value) as FieldValues;
    const resolver = gancaoZodResolver(currentScenario.value.schema, {
      locale: locale.value,
    });
    const result = await resolver(values, undefined, resolverOptions());

    status.value =
      Object.keys(result.errors).length === 0 ? 'success' : 'failure';
    output.value = JSON.stringify(result, null, 2);
  } catch (error) {
    status.value = 'failure';
    output.value = JSON.stringify(
      {
        values: {},
        errors: {
          root: {
            type: 'invalid_json',
            message: error instanceof Error ? error.message : 'JSON 解析失败',
          },
        },
      },
      null,
      2,
    );
  }
}

setInput('invalid');
</script>

<template>
  <section class="validation-playground" aria-labelledby="playground-title">
    <header class="playground-header">
      <div>
        <span class="playground-kicker">FRONTEND VALIDATION LAB</span>
        <h2 id="playground-title">React Hook Form 校验实验室</h2>
      </div>
      <span class="playground-status" :class="`is-${status}`">{{
        statusLabel
      }}</span>
    </header>

    <div class="playground-toolbar">
      <div class="playground-control-group">
        <span>场景</span>
        <div class="playground-controls" aria-label="校验场景">
          <button
            v-for="(scenario, key) in scenarios"
            :key="key"
            type="button"
            :class="{ 'is-active': scenarioKey === key }"
            @click="selectScenario(key)"
          >
            {{ scenario.label }}
          </button>
        </div>
      </div>

      <div class="playground-control-group">
        <span>语言</span>
        <div class="playground-controls" aria-label="错误语言">
          <button
            v-for="item in ['zh-CN', 'en-US'] as const"
            :key="item"
            type="button"
            :class="{ 'is-active': locale === item }"
            @click="
              locale = item;
              runValidation();
            "
          >
            {{ item }}
          </button>
        </div>
      </div>

      <div class="playground-control-group">
        <span>错误模式</span>
        <div class="playground-controls" aria-label="错误收集模式">
          <button
            v-for="item in ['firstError', 'all'] as const"
            :key="item"
            type="button"
            :class="{ 'is-active': criteriaMode === item }"
            @click="
              criteriaMode = item;
              runValidation();
            "
          >
            {{ item }}
          </button>
        </div>
      </div>
    </div>

    <div class="playground-example-actions" aria-label="载入示例">
      <button type="button" @click="setInput('valid')">有效数据</button>
      <button type="button" @click="setInput('invalid')">无效数据</button>
    </div>

    <div class="playground-grid">
      <label class="playground-pane">
        <span>表单输入 JSON</span>
        <textarea v-model="input" spellcheck="false" @input="status = 'idle'" />
      </label>
      <div class="playground-pane">
        <span>ResolverResult</span>
        <pre><code>{{ output }}</code></pre>
      </div>
    </div>

    <button
      class="playground-run"
      type="button"
      :disabled="status === 'running'"
      @click="runValidation"
    >
      运行校验
    </button>
  </section>
</template>
