<template>
  <v-layout justify-center
            class="layout-password-edit">
    <div class="password-edit-form-wrap">
      <v-form lazy-validation
              ref="form"
              v-model="valid"
              class="password-edit-form">
        <v-text-field
          v-model="modelPass"
          :rules="passRules"
          prepend-icon="lock"
          ref="passRef"
          class="password-edit-input"
          type="password"
          label="現在のパスワード"
          required></v-text-field>
        <v-text-field
          v-model="modelNextpass"
          :rules="passRules"
          prepend-icon="lock"
          ref="nextPassRef"
          class="password-edit-input"
          type="password"
          label="新しいパスワード"
          required></v-text-field>
        <v-text-field
          v-model="modelConfirm"
          :rules="confirmRules"
          prepend-icon="lock"
          ref="nextConfirmPassRef"
          class="password-edit-input"
          type="password"
          label="新しいパスワード（再確認）"
          required></v-text-field>
        <div class="password-edit-btn-wrap">
          <v-btn block ripple
                 class="primary-block-btn password-edit-btn">
            パスワードを変更する
          </v-btn>
        </div>
      </v-form>
    </div>
  </v-layout>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import axios from 'axios'
  import jwt from 'jwt-decode'

  export default {
    name: "password-edit",
    layout: 'engineer',
    scrollToTop: true,
    transitions: {
      name: 'page',
      mode: 'out-in'
    },
    data: () => ({
      //validation
      valid: true,
      modelPass: "",
      passRules: [
        v => !!v || 'パスワードを入力してください',
        v => (v && v.length >= 8) || 'パスワードは8文字以上で入力してください'
      ],
      modelNextpass: "",
      modelConfirm: "",
      confirmRules: [
        v => !!v || 'パスワードを入力してください',
        v => (v === this.modelNextpass) || 'パスワードが一致しません'
      ]
    }),
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
