<template>
  <v-layout justify-center
            class="layout-password-reset">
  </v-layout>
</template>

<script>
  export default {
    name: "password-reset",
    layout: 'engineer',
    scrollToTop: true,
    transitions: {
      name: 'page',
      mode: 'out-in'
    },
    data: () => ({}),
    head() {
      return {
        title: 'パスワードリセット'
      }
    },
    methods: {},
    computed: {}
  }
</script>

<style lang="sass" scoped>

</style>
