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
                  class="sign-in-form">
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
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn flat　color="blue darken-1"
             @click="cancelDialog">キャンセル
      </v-btn>
      <v-btn flat　color="blue darken-1"
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
    data() {
      return {
        loginToken: null,
        login: false,
        decodeId: 0,
        decodedToken: {},
        userDetail: {},
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        //validation
        valid: true,
        modelEmail: "",
        emailRules: [
          v => !!v || 'メールアドレスを入力してください',
          v => /.+@.+/.test(v) || '正しいメールアドレスを入力してください'
        ],
        modelPass: "",
        passRules: [v => !!v || 'パスワードを入力してください',],
      }
    },
    methods: {
      loginUser() {
        if (this.$refs.form.validate()) {
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
            this.addTokenAction(this.loginToken)
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
      doLogin(){
        this.$emit('login')
        alert("ログインしました！")
        if (!this.isLogin) {
          setTimeout(() => {
            this.loginAction(this.login)
          }, 200)
        }
      },
      getUser() {
        axios({
          method: 'GET',
          url: 'http://127.0.0.1:8080/api/users/' + this.decodeId + '/',
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
        this.addEmailAction(this.decodedToken.email);
        this.addNameAction(this.userDetail.name);
        this.addUserIdAction(this.decodeId);
      },
      tokenDecoded() {
        this.decodedToken = jwt(this.loginToken);
        this.decodeId = this.decodedToken.user_id;
      },
      ...mapActions('user',[
        'addEmailAction',
        'addNameAction',
        'addTokenAction',
        'addUserIdAction',
        'loginAction',
      ])
    },
    computed: {
      ...mapGetters('user',{
        email: 'emailGetter',
        isLogin: 'loginGetter',
        token: 'tokenGetter',
        userId: 'userIdGetter'
      }),
    },
  }
</script>

<style scoped lang="sass">
  .dialog-help
    font-size: 12px
    a
      color: $default_primary_color
  .sign-in-form
    width: 100%
</style>
