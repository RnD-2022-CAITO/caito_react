module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  parserOptions: {
    ecmaVersion: 8,
  },
  rules: {
    "max-len": 0,
    "require-jsdoc": 0,
    "semi": ["error", "always"],
    "quotes": ["error", "double"],
  },
};
