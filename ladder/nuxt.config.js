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
      {name: "msapplication-TileColor", content: "#4597f5"},
      {name: "theme-color", content: "#4597f5"},
      {hid: 'description', name: 'description', content: 'the ladder description'}
    ],
    link: [
      {rel: "apple-touch-icon", sizes: "180x180", href: "/favicons/apple-touch-icon.png"},
      {rel: "icon", type: "image/png", sizes: "32x32", href: "/favicons/favicon-32x32.png"},
      {rel: "icon", type: "image/png", sizes: "16x16", href: "/favicons/favicon-16x16.png"},
      {rel: "manifest", href: "/favicons/site.webmanifest"},
      {rel: "mask-icon", href: "/favicons/safari-pinned-tab.svg", color: "#4597f5"}
    ]
  },
  titleTemplate: (titleChunk) => {
    // If undefined or blank then we don't need the hyphen
    return titleChunk ? `${titleChunk} | LADDER` : 'LADDER';
  },
  generate: {
    fallback: true,
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
    '@nuxtjs/google-analytics',
    ['nuxt-sass-resources-loader',
      [
        '@/assets/styles/sass/_base.sass'
      ]
    ]
  ],
  plugins: [
    {src: '~plugins/clientInit.js', ssr: false},
  ],
  vuetify: {
    theme: {
      primary: '#3f51b5',
      secondary: '#b0bec5',
      accent: '#8c9eff',
      error: '#b71c1c'
    },
  },
  'google-analytics': {
    id: 'UA-122869257-1'
  }
}

