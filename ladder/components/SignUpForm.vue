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
                  class="sign-up-form">
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
          <a href="#" @click="directLogin">ログイン</a>
          してください
        </p>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" flat
             @click="cancelDialog">キャンセル
      </v-btn>
      <v-btn :disabled="!valid"
             color="blue darken-1" flat
             @click="postUser">登録
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import axios from 'axios'
  import jwt from 'jwt-decode'

  export default {
    name: "sign-up-form",
    data() {
      return {
        sign: false,
        valid: true,
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
        this.$emit('direct-login');
      },
      doLogin() {
        this.$emit('login')
        this.loginAction(this.login)
      },
      loginUser() {
        axios({
          method: 'POST',
          url: 'http://127.0.0.1:8080/api/api-auth/',
          headers: {
            "Accept": "application/json",
            'Content-Type': 'application/json'
          },
          data: {
            email: this.modelEmail,
            password: this.modelPass
          }
        }).then((response) => {
          this.loginToken = JSON.stringify(response.data.token).replace(/[\"]/g, "")
          this.login = true
          this.addTokenAction(this.loginToken)
        }).then(() => {
          this.doLogin()
        }).then(() => {
          this.tokenDecoded()
        }).then(() => {
          this.setUser()
        }).catch((error) => {
          console.log(error)
        })
      },
      postUser() {
        if (this.$refs.form.validate()) {
          axios({
            method: 'POST',
            url: 'http://127.0.0.1:8080/api/users/',
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
            this.signAction(true)
          }).then(() => {
            this.$emit('sign')
          }).then(() => {
            this.loginUser()
          }).catch((error) => {
            alert("登録に失敗しました")
            console.log(error)
          })
        }
      },
      tokenDecoded() {
        const decodedToken = jwt(this.loginToken);
        this.decodedId = decodedToken.user_id;
      },
      setUser() {
        this.addEmailAction(this.modelEmail);
        this.addNameAction(this.modelName);
        this.addUserIdAction(this.decodedId);
        alert('ご登録ありがとうございます！')
      },
      ...mapActions('user', [
        'addEmailAction',
        'addNameAction',
        'addTokenAction',
        'addUserIdAction',
        'loginAction',
        'signAction'
      ])
    },
    computed: {
      ...mapGetters('user', {
        email: 'emailGetter',
        name: 'nameGetter',
        isLogin: 'loginGetter',
        token: 'tokenGetter'
      }),
    },
  }
</script>

<style scoped lang="sass">
  .dialog-help
    margin: 10px 0 0
    font-size: 12px
    a
      color: $default_primary_color
  .sign-up-form
    width: 100%
</style>
