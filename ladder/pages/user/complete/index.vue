<template>
  <v-layout align-center justify-start column
            class="layout-user-complete">
  </v-layout>
</template>

<script>
  import axios from 'axios'

  export default {
    name: "user-complete",
    layout: 'engineer',
    scrollToTop: true,
    transitions: {
      name: 'page',
      mode: 'out-in'
    },
    data: () => ({}),
    head() {
      return {
        title: 'ユーザ-登録完了'
      }
    },
    components: {},
    methods: {},
    computed: {
    },
  }
</script>

<style scoped lang="sass">

</style>
