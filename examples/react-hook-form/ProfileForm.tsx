import { useFieldArray, useForm } from 'react-hook-form';

import { gancaoZodResolver } from '@clearlovesixteen/zod-react-hook-form';

import {
  profileSchema,
  type ProfileFormInput,
  type ProfileFormOutput,
} from './profileSchema.js';

export interface ProfileFormProps {
  onSave: (data: ProfileFormOutput) => void | Promise<void>;
}

/** 可直接接入业务页面的 React Hook Form 示例。 */
export function ProfileForm({ onSave }: ProfileFormProps) {
  const form = useForm<ProfileFormInput, unknown, ProfileFormOutput>({
    resolver: gancaoZodResolver(profileSchema),
    criteriaMode: 'all',
    defaultValues: {
      displayName: '',
      email: '',
      age: '',
      phone: '',
      password: '',
      confirmPassword: '',
      contacts: [{ name: '', email: '' }],
    },
  });
  const contacts = useFieldArray({
    control: form.control,
    name: 'contacts',
  });

  return (
    <form noValidate onSubmit={form.handleSubmit(onSave)}>
      <label>
        显示名称
        <input {...form.register('displayName')} />
        <span>{form.formState.errors.displayName?.message}</span>
      </label>

      <label>
        邮箱
        <input type="email" {...form.register('email')} />
        <span>{form.formState.errors.email?.message}</span>
      </label>

      <label>
        年龄
        <input inputMode="numeric" {...form.register('age')} />
        <span>{form.formState.errors.age?.message}</span>
      </label>

      <label>
        手机号
        <input inputMode="tel" {...form.register('phone')} />
        <span>{form.formState.errors.phone?.message}</span>
      </label>

      <label>
        密码
        <input type="password" {...form.register('password')} />
        <span>{form.formState.errors.password?.message}</span>
      </label>

      <label>
        确认密码
        <input type="password" {...form.register('confirmPassword')} />
        <span>{form.formState.errors.confirmPassword?.message}</span>
      </label>

      <fieldset>
        <legend>联系人</legend>
        {contacts.fields.map((field, index) => (
          <div key={field.id}>
            <input
              aria-label={`联系人 ${index + 1} 姓名`}
              placeholder="姓名"
              {...form.register(`contacts.${index}.name`)}
            />
            <input
              aria-label={`联系人 ${index + 1} 邮箱`}
              placeholder="邮箱"
              {...form.register(`contacts.${index}.email`)}
            />
            <button type="button" onClick={() => contacts.remove(index)}>
              删除
            </button>
            <span>
              {form.formState.errors.contacts?.[index]?.email?.message}
            </span>
          </div>
        ))}
        <button
          type="button"
          onClick={() => contacts.append({ name: '', email: '' })}
        >
          添加联系人
        </button>
      </fieldset>

      <button type="submit" disabled={form.formState.isSubmitting}>
        保存
      </button>
    </form>
  );
}
