module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'canonical',
  ],
  overrides: [
    {
      extends: [
        'canonical/react',
        'canonical/jsx-a11y',
      ],
      files: '*.js',
    },
    {
      extends: [
        'canonical/json',
      ],
      files: '*.json',
    },
  ],
  parser: '@babel/eslint-parser',
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
  root: true,
  rules: {},
};
