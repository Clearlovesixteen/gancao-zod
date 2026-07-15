<script setup lang="ts">
const stages = [
  {
    index: "01",
    title: "接收输入",
    detail: "表单、请求、环境变量",
    tone: "raw",
  },
  {
    index: "02",
    title: "Zod Schema",
    detail: "解析、转换、业务约束",
    tone: "schema",
  },
  {
    index: "03",
    title: "Gancao Core",
    detail: "归一化路径、消息与参数",
    tone: "core",
  },
  {
    index: "04",
    title: "稳定输出",
    detail: "data 或 ValidationError[]",
    tone: "result",
  },
] as const;
</script>

<template>
  <div class="architecture-map" aria-label="Gancao Zod 校验数据流">
    <div
      v-for="(stage, stageIndex) in stages"
      :key="stage.index"
      class="architecture-stage"
      :class="`is-${stage.tone}`"
    >
      <span class="architecture-index">{{ stage.index }}</span>
      <strong>{{ stage.title }}</strong>
      <span>{{ stage.detail }}</span>
      <span v-if="stageIndex < stages.length - 1" class="architecture-arrow" aria-hidden="true">→</span>
    </div>
  </div>
</template>
