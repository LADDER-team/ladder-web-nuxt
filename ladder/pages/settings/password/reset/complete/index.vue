<template>
  <v-layout align-center justify-start column
            class="layout-complete">
  </v-layout>
</template>

<script>
  export default {
    name: "password-complete",
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
  }
</script>

<style scoped lang="sass"></style>
