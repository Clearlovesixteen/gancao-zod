import { emailSchema, phoneSchema } from '@clearlovesixteen/zod-presets';
import { z } from '@clearlovesixteen/zod-core';

export const contactSchema = z.object({
  name: z.string().trim().min(1),
  email: emailSchema,
});

/**
 * 资料编辑表单 Schema。
 *
 * 输入类型允许 age 使用字符串；校验通过后会得到 number 类型的输出。
 */
export const profileSchema = z
  .object({
    displayName: z.string().trim().min(2),
    email: emailSchema,
    age: z.coerce.number().int().min(18),
    phone: z
      .union([phoneSchema, z.literal('')])
      .transform((value) => value || undefined),
    password: z.string().min(8).regex(/[A-Z]/),
    confirmPassword: z.string(),
    contacts: z.array(contactSchema).min(1),
  })
  .superRefine((value, context) => {
    if (value.password === value.confirmPassword) return;

    context.addIssue({
      code: 'custom',
      message: '两次输入的密码不一致',
      path: ['confirmPassword'],
    });
  });

export type ProfileFormInput = z.input<typeof profileSchema>;
export type ProfileFormOutput = z.output<typeof profileSchema>;
