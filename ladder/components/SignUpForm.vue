<template>
  <v-card>
    <v-card-title>
      <span class="headline">ユーザ登録</span>
    </v-card-title>
    <v-card-text>
      <v-container grid-list-md>
        <v-layout wrap>
          <v-form lazy-validation
                  v-model="valid"
                  ref="form"
                  class="sign-form">
            <v-text-field
              v-model="modelName"
              :rules="nameRules"
              prepend-icon="person"
              label="名前"
              ref="nameRef"
              required></v-text-field>
            <v-text-field
              v-model="modelEmail"
              :rules="emailRules"
              prepend-icon="email"
              ref="emailRef"
              label="メールアドレス"
              required></v-text-field>
            <v-text-field
              v-model="modelPass"
              :rules="passRules"
              prepend-icon="lock"
              ref="passRef"
              type="password"
              label="パスワード"
              required></v-text-field>
            <v-text-field
              v-model="modelConfirm"
              :rules="confirmRules"
              prepend-icon="lock"
              type="password"
              label="パスワード（再確認）"
              required></v-text-field>
          </v-form>
        </v-layout>
        <p class="dialog-help">
          登録済みの方はこちらから
          <a @click="directLogin" class="dialog-link">ログイン</a>
          してください
        </p>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" flat
             @click="cancelDialog">キャンセル
      </v-btn>
      <v-btn color="blue darken-1" flat
             :disabled="!valid"
             @click="registerUser">登録
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import axios from 'axios'

  export default {
    name: "sign-up-form",
    data() {
      return {
        valid: false,
        decodedId: 0,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        //validation
        modelName: "",
        nameRules: [v => !!v || '名前を入力してください'],
        modelEmail: "",
        emailRules: [
          v => !!v || 'メールアドレスを入力してください',
          v => /.+@.+/.test(v) || '正しいメールアドレスを入力してください'
        ],
        modelPass: "",
        passRules: [
          v => !!v || 'パスワードを入力してください',
          v => (v && v.length >= 8) || 'パスワードは8文字以上で入力してください'
        ],
        modelConfirm: "",
        confirmRules: [
          v => !!v || 'パスワードを入力してください',
          v => (v === this.modelPass) || 'パスワードが一致しません'
        ]
      }
    },
    methods: {
      cancelDialog() {
        this.$emit('cancel')
      },
      directLogin() {
        this.$emit('direct-login')
      },
      registerUser() {
        if (this.$refs.form.validate()) {
          axios({
            method: 'POST',
            url: 'http://localhost:8080/api/users/',
            headers: {
              "Accept": "application/json",
              'Content-Type': 'application/json',
            },
            data: {
              name: this.modelName,
              email: this.modelEmail,
              password: this.modelPass
            }
          }).then(() => {
            this.$emit('cancel')
            alert('登録ありがとうございます！登録いただいたメールアドレスに本登録用のメールを送信しました。メールの添付URLから本登録を完了してください！')
          }).then(() => {
            this.$refs.form.reset()
          }).catch((error) => {
            alert("登録に失敗しました")
            console.log(error)
          })
        }
      },
    },
  }
</script>

<style lang="sass" scoped></style>
