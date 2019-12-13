module.exports = {
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: false
    }
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/vue-mazel-ui/'
    : '/',
  css: {
    extract: false,
    loaderOptions: {
      sass: {
        prependData: `@import "@/../packages/scss/vars";`
      }
    }
  }
}
