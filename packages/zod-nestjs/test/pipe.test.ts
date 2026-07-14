import "reflect-metadata";

import { BadRequestException } from "@nestjs/common";
import { ROUTE_ARGS_METADATA } from "@nestjs/common/constants";
import { describe, expect, it } from "vitest";
import { z } from "zod";

import {
  GancaoValidationPipe,
  ZodBody,
  ZodParam,
  ZodQuery,
} from "../src/index.js";

const metadata = { type: "body" as const };

describe("GancaoValidationPipe", () => {
  it("returns parsed and transformed data", async () => {
    const pipe = new GancaoValidationPipe(
      z.object({ age: z.coerce.number().int() }),
    );

    await expect(pipe.transform({ age: "36" }, metadata)).resolves.toEqual({
      age: 36,
    });
  });

  it("throws a normalized BadRequestException", async () => {
    const pipe = new GancaoValidationPipe(
      z.object({ email: z.email() }),
      { locale: "zh-CN" },
    );

    const promise = pipe.transform({ email: "invalid" }, metadata);

    await expect(promise).rejects.toBeInstanceOf(BadRequestException);
    await expect(promise).rejects.toMatchObject({
      response: {
        statusCode: 400,
        error: "Bad Request",
        message: "Validation failed",
        errors: [
          expect.objectContaining({
            code: "invalid_format",
            field: "email",
            message: "格式不正确",
          }),
        ],
      },
    });
  });

  it("supports a custom exception factory", async () => {
    const pipe = new GancaoValidationPipe(z.number(), {
      exceptionFactory: () => new Error("custom validation failure"),
    });

    await expect(pipe.transform("1", metadata)).rejects.toThrow(
      "custom validation failure",
    );
  });
});

describe("NestJS parameter decorators", () => {
  it.each([
    ["body", ZodBody(z.object({ name: z.string() }))],
    ["query", ZodQuery(z.object({ page: z.coerce.number() }))],
    ["param", ZodParam("id", z.string().min(1))],
  ])("registers the validation pipe for %s", (_source, decorator) => {
    class Controller {
      handle(): void {}
    }

    decorator(Controller.prototype, "handle", 0);

    const routeMetadata = Reflect.getMetadata(
      ROUTE_ARGS_METADATA,
      Controller,
      "handle",
    ) as Record<string, { pipes?: unknown[] }>;
    const argument = Object.values(routeMetadata)[0];

    expect(argument?.pipes?.[0]).toBeInstanceOf(GancaoValidationPipe);
  });
});
