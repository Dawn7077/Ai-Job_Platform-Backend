import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Custom overrides can go here
      '@typescript-eslint/no-explicit-any': 'warn', // Warns against using 'any'
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // Ignores unused vars starting with _
      'no-console': 'off', // Allows console.log in backend development
    },
  },
  { 
    ignores: ['dist/', 'node_modules/'],
  }
);