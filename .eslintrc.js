module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    '@typescript-eslint/no-empty-function': 1,
    '@typescript-eslint/no-namespace': 'off',
    'no-inner-declarations': 'off',
    'no-explicit-any': 'off'
  }
};
