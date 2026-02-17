import js from '@eslint/js';
import next from '@next/eslint-plugin-next';
import globals from 'globals';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: [
      '.next/**',
      'out/**',
      'build/**',
      'coverage/**',
      'public/vendor/**',
      'public/pizza/**',
      'public/js/**',
      'assets/**',
      'css/**',
      'js/**',
      'mockups/**',
      'studio/**',
      'tools/**',
      'packages/**',
      'firebase-debug.log'
    ]
  },

  js.configs.recommended,

  // TypeScript (non-type-aware; fast enough for CI/dev loops)
  ...tseslint.configs.recommended,

  {
    files: ['**/*.{js,jsx,mjs,ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      '@next/next': next
    },
    settings: {
      react: { version: 'detect' }
    },
    rules: {
      // React + hooks
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      // A11y baseline
      ...jsxA11y.configs.recommended.rules,

      // Next.js
      ...next.configs.recommended.rules,
      ...next.configs['core-web-vitals'].rules,

      // App style tweaks
      'no-console': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/no-unknown-property': 'off'
    }
  },

  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.vitest
      }
    }
  }
];
