// eslint.config.js
import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';

export default [
  {
    ignores: ['node_modules', '.next', 'out', 'public'],
  },
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        console: 'readonly', // Ensures console is recognized globally
      },
    },

    plugins: {
      react,
      '@typescript-eslint': typescript,
      prettier,
    },

    rules: {
      ...js.configs.recommended.rules,
      ...typescript.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...prettier.configs.recommended.rules,
      // Example of skipping or turning off specific rules

      'react/prop-types': 'off', // Disables prop-types rule (if using TypeScript)
      '@typescript-eslint/explicit-module-boundary-types': 'off', // Disables explicit return type for functions
      '@typescript-eslint/no-explicit-any': 'warn',
      'react/react-in-jsx-scope': 'off', // Disable the rule as React 18 doesn't require React to be in scope
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'none',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_',
        },
      ],

      'no-console': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
