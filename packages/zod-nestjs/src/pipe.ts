import { validateAsync } from '@clearlovesixteen/zod-core';
import type {
  ValidationError,
  ValidationOptions,
} from '@clearlovesixteen/zod-core';
import { BadRequestException } from '@nestjs/common';
import type { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import type { z } from 'zod';

export type NestExceptionFactory = (
  errors: ValidationError[],
  metadata: ArgumentMetadata,
) => Error;

/** NestJS 校验管道配置。 */
export interface NestValidationOptions extends ValidationOptions {
  /** 将统一错误转换为项目自定义异常。 */
  exceptionFactory?: NestExceptionFactory;
}

/** 使用 Gancao Zod 校验并转换控制器参数。 */
export class GancaoValidationPipe<
  TSchema extends z.ZodType,
> implements PipeTransform<unknown, Promise<z.output<TSchema>>> {
  constructor(
    private readonly schema: TSchema,
    private readonly options: NestValidationOptions = {},
  ) {}

  async transform(
    value: unknown,
    metadata: ArgumentMetadata,
  ): Promise<z.output<TSchema>> {
    const result = await validateAsync(this.schema, value, this.options);

    if (result.success) {
      return result.data;
    }

    if (this.options.exceptionFactory) {
      throw this.options.exceptionFactory(result.errors, metadata);
    }

    throw new BadRequestException({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Validation failed',
      errors: result.errors,
    });
  }
}
