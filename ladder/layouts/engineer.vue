<template>
  <v-app id="inspire" indig>
    <app-bar/>
    <v-content id="window">
      <v-container
        fluid
        fill-height
        justify-center
        align-start
        class="g-container"
      >
        <nuxt/>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import AppBar from '~/components/AppBar.vue'
  import axios from 'axios'
  import jwt from 'jwt-decode'

  export default {
    data: () => ({
      loginToken: "",
      userId: 0,
      decodedToken: {},
      userDetail: {}
    }),
    components: {
      AppBar
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
      async tokenDecode() {
        this.decodedToken = await jwt(this.token);
        this.userId = await this.decodedToken.user_id;
      },
      getUser() {
        axios({
          method: 'GET',
          url: 'https://api.ladder.noframeschools.com/api/users/' + this.userId + '/',
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
        this.addUserIdAction(this.userId);
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
        isLogin: 'loginGetter'
      })
    }
  }
</script>

<style lang="sass" scoped>

</style>

