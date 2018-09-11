<template>
  <v-card>
    <v-card-title>
      <span class="headline">ユーザ登録</span>
    </v-card-title>
    <v-card-text>
      <v-container grid-list-md>
        <v-layout wrap>
          <v-form ref="form" v-model="valid"
                  lazy-validation
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
          <a href="#" @click="clickDirectLogin">ログイン</a>
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
  import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
  import axios from 'axios'

  export default {
    name: "sign-up-form",
    data() {
      return {
        sign: false,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        valid: true,
        modelName: "",
        nameRules: [v => !!v || '名前を入力してください'],
        //validation
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
      clickDirectLogin() {
        this.$emit('direct-login');
      },
      postUser() {
        if (this.$refs.form.validate()) {
          axios({
            method: 'POST',
            url: 'https://api.ladder.noframeschools.com/api/users/',
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
            this.sign = true
          }).then(() => {
            this.addSign()
          }).then(() => {
            this.emitSign()
          }).then(() => {
            this.loginPost()
          }).catch((error) => {
            alert("登録に失敗しました")
            console.log(error)
          })
        }
      },
      // },
      addSign() {
        this.signAction(this.sign)
      },
      emitSign() {
        this.$emit('sign')
      },
      loginPost() {
        axios({
          method: 'POST',
          url: 'https://api.ladder.noframeschools.com/api/api-auth/',
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
          this.addToken()
        }).then(() => {
          this.login = !this.login ? true : alert("ログイン済みです")
        }).then(() => {
          this.loginPromise()
        }).then(() => {
          this.emitLogin()
          alert("ご登録ありがとうございます！")
        }).then(() => {
          this.setUser()
        }).catch((error) => {
          console.log(error)
        })
      },
      addToken() {
        this.addTokenAction(this.loginToken)
      },
      loginPromise() {
        this.loginAction(this.login)
      },
      emitLogin() {
        this.$emit('login')
      },
      setUser() {
        this.addNameAction(this.modelName);
        this.addEmailAction(this.modelEmail);
      },
      ...mapActions('user',[
        'addEmailAction',
        'addNameAction',
        'addTokenAction',
        'loginAction',
        'signAction'
      ])
    },
    computed: {
      ...mapGetters('user',{
        name: 'nameGetter',
        email: 'emailGetter',
        isLogin: 'loginGetter',
        isSign: 'signGetter',
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
