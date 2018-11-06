// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 关闭缩进检查
    'indent':[0],
    'semi':[0],
    'brace-style': [2, 'stroustrup', { 'allowSingleLine': true }],
    'space-before-function-paren': ['error', 'never'],
    "quotes": [0],
    "one-var": [0],
    "keyword-spacing": [0],
    "key-spacing": [0],
    "no-array-constructor": [0]
  }
}