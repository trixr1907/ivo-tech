import js from '@eslint/js';
import globals from 'globals';
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
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      '@typescript-eslint/no-floating-promises': ['error', { ignoreVoid: true, ignoreIIFE: true }]
    }
  },

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
      'react-hooks': reactHooks
    },
    settings: {
      react: { version: 'detect' }
    },
    rules: {
      // React + hooks
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

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
    },
    rules: {
      'no-restricted-properties': [
        'error',
        { object: 'describe', property: 'only', message: 'Focused tests are not allowed in committed code.' },
        { object: 'it', property: 'only', message: 'Focused tests are not allowed in committed code.' },
        { object: 'test', property: 'only', message: 'Focused tests are not allowed in committed code.' }
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "MemberExpression[property.type='Literal'][property.value='only'], MemberExpression[property.type='Literal'][property.value=\"only\"]",
          message: 'Focused tests are not allowed in committed code.'
        }
      ]
    }
  }
];
