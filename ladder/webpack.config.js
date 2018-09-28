module.exports = {
  resolve: {
    extension: ['.js', '.json', '.vue', '.sass'],
    root: path.resolve(__dirname),
    alias: {
      '@': path.resolve(__dirname),
      '~': path.resolve(__dirname),
    }
  }
}
