<template>
  <v-layout justify-center
            ref="scrollWrapRef"
            id="scroll-wrap"
            class="layout-post">
    <v-flex justify-center align-start
            md7 lg7
            class="post-form-wrap">
      <v-form ref="form"
              class="sign-form">
        <v-text-field
          prepend-icon="lock"
          ref="passRef"
          type="password"
          label="現在のパスワード"
          required></v-text-field>
        <v-text-field
          prepend-icon="lock"
          ref="passRef"
          type="password"
          label="新しいパスワード"
          required></v-text-field>
        <v-text-field
          prepend-icon="lock"
          type="password"
          label="新しいパスワード（再確認）"
          required></v-text-field>
        <v-btn depressed ripple
               class="primary-btn">変更
        </v-btn>
      </v-form>
    </v-flex>
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

</style>
