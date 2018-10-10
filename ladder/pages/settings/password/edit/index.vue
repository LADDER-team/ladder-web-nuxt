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
          v-model="modelPass"
          :rules="passRules"
          prepend-icon="lock"
          ref="passRef"
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
          :rules="[
            v => !!v || '新しいパスワードを入力してください',
            v => (v === this.modelNewPass) || '新しいパスワードが一致しません'
          ]"
          prepend-icon="lock"
          ref="nextConfirmRef"
          class="password-edit-input"
          type="password"
          label="新しいパスワード（再確認）"
          required></v-text-field>
        <v-flex class="password-edit-dialog-wrap">
          <v-dialog v-model="dialog" width="500"
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
                  color="secondary" flat
                  @click="dialog = false">
                  キャンセル
                </v-btn>
                <v-btn
                  color="primary" flat>
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
    name: "password-edit",
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
      modelPass: "",
      passRules: [
        v => !!v || '現在のパスワードを入力してください',
        v => (v && v.length >= 8) || 'パスワードは8文字以上で入力してください'
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
    }),
    head() {
      return {
        title: 'パスワード変更'
      }
    },
    methods: {
      validateForm() {
        !this.modelPass && !this.modelNewPass && !this.modelConfirm ? this.unInputForm(0)
            : console.log('true')
      },
      unInputForm(input) {
        const message = input === 0 ? "フォームを埋めてください！"
            : "フォームを埋めてください！"
        alert(message)
        setTimeout(() => {
          this.dialog = false
        }, 1)
  }
    },
    computed: {
      btnDisabled() {
        return this.modelPass && this.modelNewPass && this.modelConfirm
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

</style>
