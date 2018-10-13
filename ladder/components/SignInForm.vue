<template>
  <v-card>
    <v-card-title>
      <span class="headline">ユーザログイン</span>
    </v-card-title>
    <v-card-text>
      <v-container grid-list-md>
        <v-layout wrap>
          <v-form lazy-validation
                  ref="form"
                  v-model="valid"
                  class="sign-form">
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
          </v-form>
        </v-layout>
        <p class="dialog-help">
          パスワードをお忘れの方は
          <a @click="toPasswordReset" class="dialog-link">こちら</a>
          へ
        </p>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn flat color="blue darken-1"
             @click="cancelDialog">キャンセル
      </v-btn>
      <v-btn color="blue darken-1" flat
             :disabled="!valid"
             @click="loginUser">ログイン
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import axios from 'axios'
  import jwt from 'jwt-decode'

  export default {
    name: "sign-in-form",
    data: () => ({
      loginToken: null,
      login: false,
      decodeId: 0,
      decodedToken: {},
      userDetail: {},
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      //validation
      valid: false,
      modelEmail: "",
      emailRules: [
        v => !!v || 'メールアドレスを入力してください',
        v => /.+@.+/.test(v) || '正しいメールアドレスを入力してください'
      ],
      modelPass: "",
      passRules: [v => !!v || 'パスワードを入力してください',],
    }),
    methods: {
      loginUser() {
        if (this.$refs.form.validate()) {
          axios({
            method: 'POST',
            url: 'http://localhost:8080/api/api-auth/',
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
            this.ADD_TOKEN_ACTION(this.loginToken)
            this.login = true
          }).then(() => {
            this.doLogin()
          }).then(() => {
            this.tokenDecoded()
          }).then(() => {
            this.getUser()
          }).catch((error) => {
            alert('ログインに失敗しました！')
            console.log(error)
          })
        }
      },
      cancelDialog() {
        this.$emit('cancel')
      },
      doLogin() {
        this.$emit('login')
        alert("ログインしました！")
        if (!this.isLogin) {
          setTimeout(() => {
            this.LOGIN_ACTION(this.login)
          }, 200)
        }
      },
      getUser() {
        axios({
          method: 'GET',
          url: 'http://localhost:8080/api/users/' + this.decodeId + '/',
        }).then((response) => {
          this.userDetail = response.data
        }).then(() => {
          this.setUser()
        }).catch((error) => {
          alert("ユーザの取得に失敗しました")
          console.log(error)
        })
      },
      setUser() {
        this.ADD_EMAIL_ACTION(this.decodedToken.email);
        this.ADD_NAME_ACTION(this.userDetail.name);
        this.ADD_USER_ACTION(this.decodeId);
      },
      tokenDecoded() {
        this.decodedToken = jwt(this.loginToken);
        this.decodeId = this.decodedToken.user_id;
      },
      toPasswordReset() {
        this.$emit('password-reset');
      },
      ...mapActions('user', [
        'ADD_EMAIL_ACTION',
        'ADD_NAME_ACTION',
        'ADD_TOKEN_ACTION',
        'ADD_USER_ACTION',
        'LOGIN_ACTION',
      ])
    },
    computed: {
      ...mapGetters('user', {
        email: 'EMAIL_GETTER',
        isLogin: 'LOGIN_GETTER',
        token: 'TOKEN_GETTER',
        userId: 'USER_ID_GETTER'
      }),
    },
  }
</script>

<style scoped lang="sass"></style>
