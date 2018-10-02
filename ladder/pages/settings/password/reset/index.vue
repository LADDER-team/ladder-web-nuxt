<template>
  <v-layout justify-center
            class="layout-password-reset">
    <div class="password-reset-form-wrap">
      <v-form ref="form"
              class="password-reset-form">
        <v-text-field
          prepend-icon="lock"
          ref="nextPassRef"
          class="password-reset-input"
          type="password"
          label="新しいパスワード"
          required></v-text-field>
        <v-text-field
          prepend-icon="lock"
          ref="nextConfirmPassRef"
          class="password-reset-input"
          type="password"
          label="新しいパスワード（再確認）"
          required></v-text-field>
        <div class="password-reset-btn-wrap">
          <v-btn block ripple
                 class="primary-block-btn password-reset-btn">パスワードを変更する
          </v-btn>
        </div>
      </v-form>
    </div>
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
    asyncData() {
    },
    data: () => ({}),
    head() {
      return {
        title: 'パスワード再設定'
      }
    },
    methods: {},
    computed: {}
  }
</script>

<style lang="sass" scoped>
  .password-reset-form-wrap
    max-width: 600px
    width: 100%
    height: 80%

  .password-reset-form
    background: #fff
    padding: 30px

  .password-reset-btn-wrap
    text-align: right

  .password-reset-btn
    margin: 30px 0 0

</style>
