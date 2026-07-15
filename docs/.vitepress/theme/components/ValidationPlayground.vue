<script setup lang="ts">
import { computed, ref } from "vue";
import { validate, z } from "@clearlovesixteen/zod-core";

const examples = {
  valid: {
    label: "有效数据",
    value: {
      name: "  Ada  ",
      email: "ADA@EXAMPLE.COM",
      age: "36",
    },
  },
  invalid: {
    label: "无效数据",
    value: {
      name: "",
      email: "not-an-email",
      age: "unknown",
    },
  },
} as const;

const userSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().toLowerCase().pipe(z.email()),
  age: z.coerce.number().int().positive(),
});

const input = ref(JSON.stringify(examples.valid.value, null, 2));
const output = ref("");
const status = ref<"idle" | "success" | "failure">("idle");

const statusLabel = computed(() => {
  if (status.value === "success") return "校验通过";
  if (status.value === "failure") return "校验失败";
  return "等待运行";
});

function loadExample(example: keyof typeof examples): void {
  input.value = JSON.stringify(examples[example].value, null, 2);
  runValidation();
}

function runValidation(): void {
  try {
    const parsed = JSON.parse(input.value) as unknown;
    const result = validate(userSchema, parsed);
    status.value = result.success ? "success" : "failure";
    output.value = JSON.stringify(result, null, 2);
  } catch (error) {
    status.value = "failure";
    output.value = JSON.stringify(
      {
        success: false,
        errors: [
          {
            code: "invalid_json",
            message: error instanceof Error ? error.message : "JSON 解析失败",
            path: [],
            field: "",
          },
        ],
      },
      null,
      2,
    );
  }
}

runValidation();
</script>

<template>
  <section class="validation-playground" aria-labelledby="playground-title">
    <header class="playground-header">
      <div>
        <span class="playground-kicker">LIVE VALIDATION</span>
        <h2 id="playground-title">用真实 API 观察校验结果</h2>
      </div>
      <span class="playground-status" :class="`is-${status}`">{{ statusLabel }}</span>
    </header>

    <div class="playground-controls" aria-label="示例数据">
      <button
        v-for="(example, key) in examples"
        :key="key"
        type="button"
        @click="loadExample(key)"
      >
        {{ example.label }}
      </button>
    </div>

    <div class="playground-grid">
      <label class="playground-pane">
        <span>输入 JSON</span>
        <textarea v-model="input" spellcheck="false" @input="status = 'idle'" />
      </label>
      <div class="playground-pane">
        <span>ValidationResult</span>
        <pre><code>{{ output }}</code></pre>
      </div>
    </div>

    <button class="playground-run" type="button" @click="runValidation">
      运行校验
    </button>
  </section>
</template>
