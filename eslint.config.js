// @ts-nocheck
var js = require('@eslint/js');
var globals = require('globals');
var prettier = require('eslint-plugin-prettier');

var browser = globals.browser;
browser.$import = 'readonly';

module.exports = [
  js.configs.recommended,

  {
    plugins: {
      prettier: prettier,
    },
    rules: {
      'prettier/prettier': ['error'],
    },
  },

  {
    files: ['**/*.js'],
    languageOptions: {
      globals: browser,
      ecmaVersion: 2015,
      sourceType: 'commonjs',
    },
    rules: {
      'no-console': [
        'error',
        {
          allow: ['warn', 'error'],
        },
      ],
      'no-unused-vars': 'warn',
      'no-var': 'off',
    },
  },
];
