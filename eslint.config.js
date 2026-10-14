import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: ['dist/**', 'generated/**', 'node_modules/**'],
  },
  {
    files: ['scripts/**/*.mjs'],
    languageOptions: {
      globals: { console: 'readonly', process: 'readonly' },
    },
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue', 'src/**/*.ts'],
    languageOptions: {
      // Browser app: expose the DOM globals used by the Vue entry points.
      globals: { window: 'readonly', document: 'readonly' },
      parserOptions: {
        parser: tseslint.parser,
      },
    },
    rules: {
      // Stylistic rules that conflict with Prettier's whitespace handling.
      'vue/singleline-html-element-content-newline': 'off',
      'vue/max-attributes-per-line': 'off',
      // The diorama SVG is a static, trusted local asset assembled from
      // src/svg/fragments; v-html is the simplest Stage 1 integration.
      'vue/no-v-html': 'off',
    },
  },
)
