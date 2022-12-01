module.exports = {
  ...require('@pitcher/eslint-config/prettier.config'),
  overrides: [
    {
      files: ['*.mts', '*.cts', '*.ts'],
      options: { parser: 'typescript' },
      singleQuote: true,
    },
  ],
}
