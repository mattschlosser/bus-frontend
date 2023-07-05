module.exports = {
  root: true,
  env: {
    node: true,
  },
  'extends': [
    'plugin:vue/vue3-recommended',
    'eslint:recommended'
  ],
  globals: {
    L: "readonly"
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    "vue/max-attributes-per-line": ["error", {
      "singleline": {
        "max": 4
      },
      "multiline": {
        "max": 1
      }
    }]
  }
}
