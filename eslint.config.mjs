// eslint.config.mjs
// import tseslint from 'typescript-eslint';
// import eslintConfigPrettier from 'eslint-config-prettier';
// import globals from 'globals';

// export default [
//     {
//         ignores: ['dist/**', 'node_modules/**'],
//     },

//     // Apply TS-ESLint only to src/**
//     ...tseslint.configs.recommendedTypeChecked.map(c => ({
//         ...c,
//         files: ['src/client/**/*.{ts,tsx}', 'src/server/**/*.{ts,tsx}'],
//     })),

//     {
//         files: ['src/client/**/*.{ts,tsx}', 'src/server/**/*.{ts,tsx}'],
//         plugins: {
//             '@typescript-eslint': (await import('typescript-eslint')).default.plugin,
//         },
//         languageOptions: {
//             parserOptions: {
//                 project: ['./tsconfig.server.json', './tsconfig.client.json'],
//                 tsconfigRootDir: import.meta.dirname,
//             },
//             globals: { ...globals.node, ...globals.jest },
//         },
//         rules: {
//             // '@typescript-eslint/no-unsafe-assignment': 'off',
//             // '@typescript-eslint/no-unsafe-member-access': 'off',
//             // '@typescript-eslint/no-unsafe-call': 'off',
//             // '@typescript-eslint/no-unsafe-return': 'off',
//             // '@typescript-eslint/interface-name-prefix': 'off',
//             // '@typescript-eslint/explicit-function-return-type': 'error',
//             // '@typescript-eslint/explicit-module-boundary-types': 'off',
//             // '@typescript-eslint/no-explicit-any': 'off' // or 'warn'

//             // Only this check:
//             '@typescript-eslint/no-unused-vars': ['error', {
//                 vars: 'all',
//                 args: 'after-used',
//                 ignoreRestSiblings: true,
//                 varsIgnorePattern: '^_',
//                 argsIgnorePattern: '^_',
//             }],

//             // Turn off the rest
//             '@typescript-eslint/no-explicit-any': 'off',
//             '@typescript-eslint/explicit-function-return-type': 'off',
//             '@typescript-eslint/explicit-module-boundary-types': 'off',
//             '@typescript-eslint/no-unsafe-assignment': 'off',
//             '@typescript-eslint/no-unsafe-member-access': 'off',
//             '@typescript-eslint/no-unsafe-call': 'off',
//             '@typescript-eslint/no-unsafe-return': 'off',
//         }
//     },

//     eslintConfigPrettier,
// ];

// eslint.config.mjs
import tseslint from 'typescript-eslint';

export default [
  { ignores: ['dist/**', 'node_modules/**', 'src/shared/generated.types.ts'] },
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        // project is optional if you don't need type-aware rules
        // project: ['./tsconfig.server.json', './tsconfig.client.json'],
        tsconfigRootDir: import.meta.dirname,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: { '@typescript-eslint': tseslint.plugin },
    rules: {
      // keep only unused imports/vars for now
      '@typescript-eslint/no-unused-vars': ['error', {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: true,
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
      }],
      // ensure all “unsafe/any” rules are off
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
];