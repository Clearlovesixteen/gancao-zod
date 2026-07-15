# API 参考

本页列出当前版本的全部公开导出。只依赖这里列出的入口，避免从包内部路径导入实现文件。

## `zod-core`

### 函数

```ts
function validate<TSchema extends z.ZodType>(
  schema: TSchema,
  input: unknown,
  options?: ValidationOptions,
): ValidationResult<z.output<TSchema>>;

function validateAsync<TSchema extends z.ZodType>(
  schema: TSchema,
  input: unknown,
  options?: ValidationOptions,
): Promise<ValidationResult<z.output<TSchema>>>;

function createValidator<TSchema extends z.ZodType>(
  schema: TSchema,
  defaults?: ValidationOptions,
): (
  input: unknown,
  options?: ValidationOptions,
) => ValidationResult<z.output<TSchema>>;
```

| 导出 | 签名摘要 |
| --- | --- |
| `normalizeIssue` | `(issue: z.ZodIssue, locale?: string) => ValidationError` |
| `normalizeIssues` | `(issues: z.ZodIssue[], locale?: string) => ValidationError[]` |
| `formatIssueMessage` | `(issue: z.ZodIssue, locale?: string) => string` |
| `registerLocale` | `(locale: string, dictionary: LocaleDictionary) => void` |
| `setDefaultLocale` | `(locale: string) => void` |
| `getDefaultLocale` | `() => string` |

### 类型

```ts
type ValidationPath = Array<string | number>;

interface ValidationOptions {
  locale?: string;
}

type MessageFormatter = (issue: z.ZodIssue) => string;
type LocaleDictionary = Partial<Record<string, MessageFormatter>>;
```

同时导出：`ValidationError`、`ValidationSuccess<T>`、`ValidationFailure`、`ValidationResult<T>` 和 Zod 的 `z`。

## `zod-presets`

| 导出 | 输入与行为 |
| --- | --- |
| `idSchema` | trim 后的非空字符串 |
| `uuidSchema` | UUID 字符串 |
| `emailSchema` | trim、小写、email 格式 |
| `phoneSchema` | 中国大陆 11 位手机号 |
| `pageSchema` | 正整数，默认 1 |
| `pageSizeSchema` | 1 到 100 的整数，默认 20 |
| `paginationSchema` | `{ page, pageSize }` |
| `isoDateSchema` | ISO 日期 |
| `isoDateTimeSchema` | 带 offset 的 ISO datetime |
| `envBooleanSchema` | `true/false/1/0` 转 boolean |
| `envNumberSchema` | 非空字符串转有限数字 |

## `zod-react-hook-form`

```ts
function gancaoZodResolver<
  TInput extends FieldValues,
  TContext = unknown,
  TOutput = TInput,
>(
  schema: z.ZodType<TOutput, TInput>,
  validationOptions?: ValidationOptions,
): Resolver<TInput, TContext, TOutput>;
```

## `zod-express`

```ts
function validateRequest<TSchemas extends RequestSchemas>(
  schemas: TSchemas,
  options?: RequestValidationOptions,
): AsyncRequestHandler;
```

公开类：`RequestValidationError`。

公开类型：`AsyncRequestHandler`、`InferValidatedRequest`、`RequestSchemas`、`RequestValidationErrorHandler`、`RequestValidationErrors`、`RequestValidationFailure`、`RequestValidationOptions`、`ValidatedRequestData`。

## `zod-nestjs`

```ts
class GancaoValidationPipe<TSchema extends z.ZodType>
  implements PipeTransform<unknown, Promise<z.output<TSchema>>>;

function ZodBody<TSchema extends z.ZodType>(
  schema: TSchema,
  options?: NestValidationOptions,
): ParameterDecorator;

function ZodQuery<TSchema extends z.ZodType>(
  schema: TSchema,
  options?: NestValidationOptions,
): ParameterDecorator;
```

`ZodParam` 支持整个 params 对象和单个命名参数两种重载。公开类型还包括 `NestExceptionFactory` 和 `NestValidationOptions`。
