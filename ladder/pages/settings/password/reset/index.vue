<template>
  <v-layout justify-center
            class="layout-password-reset">
    <v-flex justify-center align-start
            class="password-reset-form-wrap">
      <v-form lazy-validation
              ref="form"
              v-model="valid"
              class="password-reset-form">
        <v-text-field
          v-model="modelNewPass"
          :rules="newPassRules"
          prepend-icon="lock"
          ref="newPassRef"
          class="password-reset-input"
          type="password"
          label="新しいパスワード"
          required></v-text-field>
        <v-text-field
          v-model="modelConfirm"
          :rules="[
            v => !!v || '新しいパスワードを入力してください',
            v => (v === this.modelNewPass) || '新しいパスワードが一致しません'
          ]"
          prepend-icon="lock"
          ref="nextConfirmRef"
          class="password-reset-input"
          type="password"
          label="新しいパスワード（再確認）"
          required></v-text-field>
        <v-flex class="password-edit-dialog-wrap">
          <v-dialog v-model="dialog" width="500"
                    class="password-reset-dialog"
                    v-bind:disabled="!btnDisabled">
            <v-btn slot="activator"
                   block ripple
                   @click="validateForm"
                   :disabled="!btnDisabled"
                   class="primary-block-btn password-reset-btn">
              パスワードを変更する
            </v-btn>
            <v-card>
              <v-card-title class="headline dialog-title">
                変更確認
              </v-card-title>
              <v-card-text>
                パスワードを変更しますか？
                変更後はTOPに遷移します！
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="secondary" flat
                  @click="dialog = false">
                  キャンセル
                </v-btn>
                <v-btn
                  color="primary"
                  @click="resetPassword"
                  flat>
                  変更する
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-flex>
      </v-form>
    </v-flex>
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
    data: () => ({
      dialog: false,
      //validation
      valid: false,
      modelNewPass: "",
      newPassRules: [
        v => !!v || 'パスワードを入力してください',
        v => (v && v.length >= 8) || 'パスワードは8文字以上で入力してください'
      ],
      modelConfirm: "",
      confirmRules: [
        v => !!v || 'パスワードを入力してください',
        v => (v === this.modelNewPass) || 'パスワードが一致しません'
      ]
    }),
    head() {
      return {
        title: 'パスワードリセット'
      }
    },
    methods: {
      validateForm() {
        if (!this.$refs.form.validate()) {
          alert('フォームに不備があります！')
          setTimeout(() => {
            this.dialog = false
          }, 1)
        }
      },
      resetPassword() {
        this.dialog = false
        this.$router.push('/')
      }
    },
    computed: {
      btnDisabled() {
        return this.modelNewPass && this.modelConfirm
      }
    }
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

  .password-reset-btn
    margin: 30px 0 0
    width: 100%

  .password-reset-dialog
    display: block!important
</style>
