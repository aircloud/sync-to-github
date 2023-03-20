module.exports = {
  root: true,
  extends: ['@hai-platform'],
  overrides: [
    {
      files: ['*.js', '*.mjs', '*.cjs'],
      rules: {
        'no-console': [
          'warn',
          {
            allow: ['info', 'warn', 'error'],
          },
        ],
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      extends: ['@hai-platform/react'],
      parserOptions: {
        project: ['./apps/**/tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
      rules: {
        'react/prop-types': [2, { ignore: ['children'] }],
        'require-await': 'error',
        'import/no-extraneous-dependencies': 'off',
        'react/require-default-props': 'off',
        'react/button-has-type': 'off',
        'no-underscore-dangle': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        'class-methods-use-this': 'off',
        'prefer-template': 'off',
        'import/prefer-default-export': 'off',
        'no-console': [
          'warn',
          {
            allow: ['info', 'warn', 'error'],
          },
        ],
      },
    },
  ],
}
