module.exports = {
  root: true,
  extends: [
    '@react-native',
    '@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',

  plugins: ['@typescript-eslint'],

  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'react-native/no-inline-styles': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
  },
};

