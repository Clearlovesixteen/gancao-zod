import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';

import ArchitectureMap from './components/ArchitectureMap.vue';
import ValidationPlayground from './components/ValidationPlayground.vue';
import './style.css';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('ArchitectureMap', ArchitectureMap);
    app.component('ValidationPlayground', ValidationPlayground);
  },
} satisfies Theme;
