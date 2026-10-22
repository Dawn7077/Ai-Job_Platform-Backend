import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Custom overrides can go here
      // '@typescript-eslint/no-explicit-any': 'warn', // Warns against using 'any'
      '@typescript-eslint/no-explicit-any': 'off',  
      '@typescript-eslint/no-unused-vars': [
        'warn', // or 'error' if you want it strict
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ], 
      // '@typescript-eslint/no-unused-vars': 'off',
      'no-console': 'off', // Allows console.log in backend development
      '@typescript-eslint/require-await': 'warn',
      // '@typescript-eslint/no-floating-promises': 'error',  // Prevent accidental un-awaited promises    
    },
  },
  { 
    ignores: ['dist/', 'node_modules/'],
  }
);
