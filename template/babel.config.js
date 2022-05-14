module.exports = {
  presets: [
    ['@babel/env', {
      targets: {
        node: 8
      }
    }]
  ],
  env: {
    coverage: {
      plugins: ['istanbul']
    }
  },
  comments: false
}
