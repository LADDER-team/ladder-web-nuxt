<template>
  <v-app id="inspire" indig>
    <app-bar/>
    <v-content id="window" class="contents-wrap">
      <v-container
        fluid fill-height justify-center align-start
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
      loginToken: "",
      decodedId: "",
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
          url: 'https://api.ladder.noframeschools.com/api/users/' + this.decodedId + '/',
        }).then((response) => {
          this.userDetail = response.data
        }).then(() => {
          this.setUser()
        }).then(() => {
          if (!this.isLogin) {
            this.loginAction(true)
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      setUser() {
        this.addNameAction(this.userDetail.name);
        this.addEmailAction(this.decodedToken.email);
        if (!this.userId) {
          this.addUserIdAction(this.decodedId);
        }
      },
      ...mapActions('user', [
        'addEmailAction',
        'addNameAction',
        'addUserIdAction',
        'loginAction',
      ])
    },
    computed: {
      ...mapGetters('user', {
        token: 'tokenGetter',
        isLogin: 'loginGetter',
        userId: 'userIdGetter',
      })
    }
  }
</script>

<style lang="sass" scoped>
  .contents-wrap
    overflow: hidden
</style>

