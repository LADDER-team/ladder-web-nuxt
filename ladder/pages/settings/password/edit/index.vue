<template>
  <v-layout justify-center
            class="layout-password-edit">
    <div class="password-edit-form-wrap">
      <v-form ref="form"
              class="password-edit-form">
        <v-text-field
          prepend-icon="lock"
          ref="passRef"
          class="password-edit-input"
          type="password"
          label="現在のパスワード"
          required></v-text-field>
        <v-text-field
          prepend-icon="lock"
          ref="nextPassRef"
          class="password-edit-input"
          type="password"
          label="新しいパスワード"
          required></v-text-field>
        <v-text-field
          prepend-icon="lock"
          ref="nextConfirmPassRef"
          class="password-edit-input"
          type="password"
          label="新しいパスワード（再確認）"
          required></v-text-field>
        <div class="password-edit-btn-wrap">
          <v-btn block ripple
                 class="primary-block-btn password-edit-btn">パスワードを変更する
          </v-btn>
        </div>
      </v-form>
    </div>
  </v-layout>
</template>

<script>
  export default {
    name: "password-edit",
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
        title: 'Password'
      }
    },
    methods: {},
    computed: {}
  }
</script>

<style lang="sass" scoped>
  .password-edit-form-wrap
    max-width: 600px
    width: 100%
    height: 80%

  .password-edit-form
    background: #fff
    padding: 30px

  .password-edit-btn-wrap
    text-align: right

  .password-edit-btn
    margin: 30px 0 0

</style>
