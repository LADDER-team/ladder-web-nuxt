<template>
  <v-app id="inspire" indig>
    <app-bar/>
    <v-content id="window" class="contents-wrap">
      <v-container
        fluid justify-center align-start
        class="g-container"
      >
        <nuxt/>
      </v-container>
    </v-content>
    <bottom-bar/>
  </v-app>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import AppBar from '~/components/AppBar'
  import BottomBar from '~/components/BottomBar'
  import axios from 'axios'
  import jwt from 'jwt-decode'

  export default {
    data: () => ({
      decodedId: "",
      loginToken: "",
      decodedToken: {},
      userDetail: {}
    }),
    components: {
      AppBar,
      BottomBar
    },
    created() {
      if (this.token) {
        this.autoAuth()
      } else {
        console.log('have not token')
      }
    },
    methods: {
      async autoAuth() {
        await this.tokenDecode()
        await this.getUser()
      },
      tokenDecode() {
        this.decodedToken = jwt(this.token);
        this.decodedId = this.decodedToken.user_id;
      },
      getUser() {
        axios({
          method: 'GET',
          url: 'http://localhost:8080/api/users/' + this.decodedId + '/',
        }).then((response) => {
          this.userDetail = response.data
        }).then(() => {
          this.setUser()
        }).then(() => {
          if (!this.isLogin) {
            this.LOGIN_ACTION(true)
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      setUser() {
        this.ADD_EMAIL_ACTION(this.decodedToken.email);
        this.ADD_NAME_ACTION(this.userDetail.name);
        if (!this.userId) {
          this.ADD_USER_ACTION(this.decodedId);
        }
      },
      ...mapActions('user', [
        'ADD_EMAIL_ACTION',
        'ADD_NAME_ACTION',
        'ADD_USER_ACTION',
        'LOGIN_ACTION',
      ])
    },
    computed: {
      ...mapGetters('user', {
        isLogin: 'LOGIN_GETTER',
        token: 'TOKEN_GETTER',
        userId: 'USER_ID_GETTER',
      })
    }
  }
</script>

<style lang="sass" scoped>
  .contents-wrap
    overflow: hidden
    padding: 0!important
  .g-container
    display: flex
    padding: 0 8px 0!important
    margin: 60px 0 0
    height: 100%
    @media (min-width: $media_desktop_sm)
      padding: 0 16px 0!important
      margin: 80px 0 0
      height: 100%
</style>

