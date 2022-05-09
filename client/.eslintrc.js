module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
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
  rules: {
    'arrow-body-style': 'off',
    'canonical/filename-match-exported': 'off',
    'canonical/id-match': 'off',
    'func-style': 'off',
    'unicorn/numeric-separators-style': 'off',
  },
};
