// eslint.config.mjs
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
    {
        ignores: ['dist/**', 'node_modules/**'],
    },

    // Apply TS-ESLint only to src/**
    ...tseslint.configs.recommendedTypeChecked.map(c => ({
        ...c,
        files: ['src/client/**/*.{ts,tsx}', 'src/server/**/*.{ts,tsx}'],
    })),

    {
        files: ['src/client/**/*.{ts,tsx}', 'src/server/**/*.{ts,tsx}'],
        plugins: {
            '@typescript-eslint': (await import('typescript-eslint')).default.plugin,
        },
        languageOptions: {
            parserOptions: {
                project: ['./tsconfig.server.json', './tsconfig.client.json'],
                tsconfigRootDir: import.meta.dirname,
            },
            globals: { ...globals.node, ...globals.jest },
        },
        rules: {
            '@typescript-eslint/interface-name-prefix': 'off',
            '@typescript-eslint/explicit-function-return-type': 'error',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-explicit-any': 'error',
        },
    },

    eslintConfigPrettier,
];