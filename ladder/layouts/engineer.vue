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
  import AppBar from '~/components/AppBar.vue'
  import {mapGetters} from 'vuex'

  export default {
    data: () => ({
      loginToken: ""
    }),
    components: {
      AppBar
    },
    created() {
      if (this.token) {
        this.autoAuth()
      }
    },
    methods: {
      async autoAuth() {
        userId = await this.tokenDecode()
        await this.getUser(userId)
      },
    },
    computed: {
      ...mapGetters('user',{
        token: 'tokenGetter'
      })
    }
  }
</script>

<style lang="sass" scoped>

</style>

