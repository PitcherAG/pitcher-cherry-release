module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
    jest: true,
    browser: true,
  },
  plugins: ['prettier'],
  extends: ['@pitcher/eslint-config/javascript', 'prettier'],
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': ['error'],
  },
}
