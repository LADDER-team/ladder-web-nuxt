<template>
  <v-layout align-center justify-start column
            class="layout-user-complete">
    <h2>WELCOME TO LADDER</h2>
    <router-link :to="{name: 'index', params: {isRegister: true}}">topへ</router-link>
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
    beforeMount() {
      const params = new URLSearchParams(window.location.search)
      const paramToken = params.get('token')
      axios({
        method: 'GET',
        url: 'http://localhost:8080/api/users/complete/?token=' + paramToken,
      }).catch((error) => {
        alert("本登録に失敗しました！")
        console.log(error)
      })
    },
    components: {},
    methods: {},
  }
</script>

<style scoped lang="sass">

</style>
