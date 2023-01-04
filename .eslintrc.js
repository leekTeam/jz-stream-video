module.exports = {
  root: true,
  extends: [
    '@antfu',
  ],
  globals: {
    uni: 'readonly',
  },
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
  ignorePatterns: ['!*.d.ts'],
}
