import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import importPlugin from 'eslint-plugin-import'
// eslint-disable-next-line import/no-unresolved
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
    globalIgnores(['dist']),
    {
        files: ['**/*.{js,jsx}'],
        plugins: {
            import: importPlugin,
        },
        extends: [
            js.configs.recommended,
            reactHooks.configs['recommended-latest'],
            reactRefresh.configs.vite,
        ],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parserOptions: {
                ecmaVersion: 'latest',
                ecmaFeatures: { jsx: true },
                sourceType: 'module',
            },
        },
        rules: {
            'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],

            // 🚨 Evita errores de imports con mayúsculas/minúsculas incorrectas
            'import/no-unresolved': 'error',

            // ⚠️ No permitas imports duplicados o redundantes
            'import/no-duplicates': 'error',

            // 💅 Orden y limpieza en imports
            'import/order': ['warn', { 'newlines-between': 'always' }],
        },
    },
])
