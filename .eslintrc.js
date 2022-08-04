module.exports = {
  root: true,
  env: {
    node: true,
  },
  ignorePatterns: [
    'src/generated/**/*.ts',
    'vue.config.js',
    'node_modules',
  ],
  extends: [
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-typescript',
  ],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
  },
  plugins: [
  ],
  rules: {
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-var': 'error',
    '@typescript-eslint/no-unused-vars': ['warn', { args: 'none', ignoreRestSiblings: true }],
    '@typescript-eslint/no-explicit-any': ['off'],
    'space-before-function-paren': ['error', { anonymous: 'always', named: 'never', asyncArrow: 'always' }],
    'comma-dangle': ['error', 'always-multiline'],
    'vue/html-self-closing': ['error', { html: { void: 'never', normal: 'never', component: 'always' } }],
    'vue/html-indent': 'error',
    'vue/html-closing-bracket-newline': ['off'],
    'vue/max-attributes-per-line': ['off'],
    'vue/no-v-html': ['off'],
    'vue/singleline-html-element-content-newline': 'off',
    'vue/no-mutating-props': 'warn',
    'standard/no-callback-literal': 'off',
    // 'app/require-prop-types': 'off',
    // camelcase: 'off', // because we work with python backend

    // 'app/max-attributes-per-line': ['error', { 'singleline': 12, 'multiline': { 'max': 1 } }],
    // "@typescript-eslint/no-unused-vars": "off",
    // "unused-imports/no-unused-vars-ts": ["warn", { vars: "all", varsIgnorePattern: "^_", args: "after-used", argsIgnorePattern: "^_" }],
    // 'no-trailing-spaces': 'off',
  },
  // overrides: [
  //   {
  //     files: [
  //       '**/__tests__/*.{j,t}s?(x)',
  //       'tests/unit/**/*.spec.{j,t}s?(x)',
  //       'tests/e2e/**/*.ts',
  //     ],
  //     plugins: [
  //     ],
  //     env: {
  //     },
  //   },
  // ],
}
