module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'ladder',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: 'Nuxt.js project'}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
    ]
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
  vuetify: {
    theme: {
      primary: '#3f51b5',
      secondary: '#b0bec5',
      accent: '#8c9eff',
      error: '#b71c1c'
    },
  }
}

