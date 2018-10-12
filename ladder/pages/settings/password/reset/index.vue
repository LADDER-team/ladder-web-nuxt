<template>
  <v-layout justify-center
            class="layout-password-reset">
    <v-flex justify-center align-start
            class="password-reset-form-wrap">
      <v-form lazy-validation
              ref="form"
              v-model="valid"
              class="password-reset-email-form">
        <v-text-field
          v-model="modelEmail"
          :rules="emailRules"
          prepend-icon="email"
          ref="emailRef"
          class="password-reset-email-input"
          label="メールアドレス"
          required></v-text-field>
        <v-flex class="password-edit-dialog-wrap">
          <v-dialog v-model="dialog" width="500"
                    class="password-reset-email-dialog"
                    v-bind:disabled="!btnDisabled">
            <v-btn slot="activator"
                   block ripple
                   @click="validateForm"
                   :disabled="!btnDisabled"
                   class="primary-block-btn password-reset-email-btn">
              メールアドレスを送信する
            </v-btn>
            <v-card>
              <v-card-title class="headline dialog-title">
                確認
              </v-card-title>
              <v-card-text>
                メールアドレスにお間違えはございませんか？
                送信後はメールをご確認ください！
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
                  @click="sendEmail"
                  flat>
                  送信する
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
      modelEmail: "",
      emailRules: [
        v => !!v || 'メールアドレスを入力してください',
        v => /.+@.+/.test(v) || '正しいメールアドレスを入力してください'
      ],
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
      sendEmail() {
        this.dialog = false
        this.$router.push('/')
        alert("送信しました！メールをご確認ください！")
      }
    },
    computed: {
      btnDisabled() {
        return this.modelEmail
      }
    }
  }
</script>

<style lang="sass" scoped>
  .password-reset-form-wrap
    max-width: 600px
    width: 100%
    height: 80%

  .password-reset-email-form
    background: #fff
    padding: 30px

  .password-reset-email-btn
    margin: 30px 0 0
    width: 100%

  .password-reset-email-dialog
    display: block!important
</style>
