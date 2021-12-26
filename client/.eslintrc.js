module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint-config-canonical',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 13,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {},
};
