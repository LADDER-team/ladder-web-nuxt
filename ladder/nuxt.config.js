module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '%s | LADDER',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {name: 'robots', content: 'noindex'},
      {hid: 'description', name: 'description', content: 'the ladder description'}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/icons/ladder_icon_white.png'}
    ]
  },
  titleTemplate: (titleChunk) => {
    // If undefined or blank then we don't need the hyphen
    return titleChunk ? `${titleChunk} | LADDER` : 'LADDER';
  },
  generate: {
    fallback: true, // '404.html' を使用したい場合
  },
  /*
  ** Customize the progress bar color
  */
  loading: {color: '#3B8070'},
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    cssSourceMap: false,
    extend(config, {isDev, isClient}) {
      if (isDev && isClient) {
        config.module.rules.push(
          {
            enforce: 'pre',
            test: /\.(js|vue)$/,
            loader: 'eslint-loader',
            exclude: /(node_modules)/
          },
        )
      }
    }
  },
  modules: [
    '@nuxtjs/vuetify',
    ['nuxt-sass-resources-loader',
      [
        '@/assets/styles/sass/_base.sass'
      ]
    ]
  ],
  plugins: [{ src: '~/plugins/clientInit.js', ssr: false }],
  vuetify: {
    theme: {
      primary: '#3f51b5',
      secondary: '#b0bec5',
      accent: '#8c9eff',
      error: '#b71c1c'
    },
  }
}

