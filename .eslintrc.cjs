module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended', // if using TypeScript
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser', // if using TypeScript
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': [
      'warn', // Change this to "warn" to style it as a warning instead of an error.
      {
        vars: 'all',
        args: 'none',
        ignoreRestSiblings: true,
        varsIgnorePattern: '^_', // Ignore variables that start with an underscore.
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
