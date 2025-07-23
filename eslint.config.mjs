import js from '@eslint/js';
import globals from 'globals';
import {defineConfig} from 'eslint/config';
import google from 'eslint-config-google';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: {js},
    extends: [
      js.configs.recommended,
      google,
    ],
    rules: {
      'require-jsdoc': 'off',
      'valid-jsdoc': 'off',
      'max-len': [
        'error',
        {
          code: 100,
          ignoreUrls: true,
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true,
          ignoreStrings: true,
        },
      ],
      'new-cap': 'off',
    },
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
    },
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
]);
