<template>
  <v-layout justify-center fill-height
            class="layout-password">
    <p>you will use Vuetify components. Access to <a href="https://vuetifyjs.com/ja/">https://vuetifyjs.com/ja/</a></p>
  </v-layout>
</template>

<script>
  export default {
    name: "password",
    layout: 'engineer',
    scrollToTop: true,
    transitions: {
      name: 'page',
      mode: 'out-in'
    },
    asyncData() {},
    data: () => ({}),
    head() {
      return {
        title: 'Password'
      }
    },
    methods: {},
    computed: {}
  }
</script>

<style lang="sass" scoped>
  /*!
      >>> sass write here <<<

      colors: /assets/styles/sass/_colors.sass
      media queries: /assets/styles/sass/_devices.sass
      some styles: /assets/styles/sass/_base.sass
    */
  a
    color: blue
    &:hover
      border-bottom: 1px solid blue
</style>
