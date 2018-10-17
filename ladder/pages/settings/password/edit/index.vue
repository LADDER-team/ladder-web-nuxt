<template>
  <v-layout justify-center
            class="layout-password-edit">
    <v-flex justify-center align-start
            class="password-edit-form-wrap">
      <v-form lazy-validation
              ref="form"
              v-model="valid"
              class="password-edit-form">
        <v-text-field
          v-model="modelOldPass"
          :rules="oldPassRules"
          prepend-icon="lock"
          ref="oldPassRef"
          class="password-edit-input"
          type="password"
          label="現在のパスワード"
          required></v-text-field>
        <v-text-field
          v-model="modelNewPass"
          :rules="newPassRules"
          prepend-icon="lock"
          ref="newPassRef"
          class="password-edit-input"
          type="password"
          label="新しいパスワード"
          required></v-text-field>
        <v-text-field
          v-model="modelConfirm"
          :rules="confirmRules"
          prepend-icon="lock"
          ref="nextConfirmRef"
          class="password-edit-input"
          type="password"
          label="新しいパスワード（再確認）"
          required></v-text-field>
        <v-flex class="password-edit-dialog-wrap">
          <v-dialog v-model="dialog" width="500"
                    class="password-edit-dialog"
                    v-bind:disabled="!btnDisabled">
            <v-btn slot="activator"
                   block ripple
                   @click="validateForm"
                   :disabled="!btnDisabled"
                   class="primary-block-btn password-edit-btn">
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
                  color="primary" flat
                  @click="dialog = false">
                  キャンセル
                </v-btn>
                <v-btn
                  color="primary" flat
                  @click="editPassword">
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
  import axios from 'axios'
  import {mapGetters} from 'vuex'

  export default {
    name: "password-edit",
    layout: 'engineer',
    scrollToTop: true,
    transitions: {
      name: 'page',
      mode: 'out-in'
    },
    data() {
      return {
        dialog: false,
        //validation
        valid: false,
        modelOldPass: "",
        oldPassRules: [
          v => !!v || '現在のパスワードを入力してください'
        ],
        modelNewPass: "",
        newPassRules: [
          v => !!v || '新しいパスワードを入力してください',
          v => (v && v.length >= 8) || 'パスワードは8文字以上で入力してください'
        ],
        modelConfirm: "",
        confirmRules: [
          v => !!v || '新しいパスワードを入力してください',
          v => (v === this.modelNewPass) || '新しいパスワードが一致しません'
        ],
      }
    },
    head() {
      return {
        title: 'パスワード変更'
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
      editPassword() {
        if (this.$refs.form.validate()) {
          axios({
            method: 'PUT',
            url: 'http://localhost:8080/api/password/change/',
            headers: {
              "Authorization": "JWT " + this.token,
              "Content-type": "application/json"
            },
            data: {
              old_password: this.modelOldPass,
              new_password: this.modelNewPass
            }
          }).then(() => {
            alert("パスワードが変更されました！")
          }).then(() => {
            this.$router.push('/')
          }).catch((error) => {
            alert("現在のパスワードが間違っています")
            this.dialog = false
            console.log(error)
          })
        }
      }
    },
    computed: {
      ...mapGetters('user', {
        token: 'TOKEN_GETTER'
      }),
      btnDisabled() {
        return this.modelOldPass && this.modelNewPass && this.modelConfirm
      }
    }
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
    width: 100%

  .password-edit-dialog
    display: block !important

</style>
