<template>
  <v-toolbar class="g-toolbar" fixed align-center>
    <h1 class="g-toolbar-title">
      <router-link :to="`/`" class="g-toolbar-logo">

      </router-link>
    </h1>
    <v-flex md2 class="g-search-wrap">
      <v-text-field hide-details
                    name="input-1"
                    prepend-icon="search"
                    rows=1
                    class="g-search-field"></v-text-field>
    </v-flex>
    <v-spacer></v-spacer>
    <v-toolbar-items class="avatar align-center g-toolbar-items">
      <v-btn depressed ripple
             @click="toLadderPost"
             class="primary-btn">
        投稿する
      </v-btn>
      <v-btn slot="activator"
             dark round outline small
             @click="toLadderManagement"
             class="avatar-btn g-toolbar-btn">
        <v-avatar :tile=false :size=40>
          <img class="g-toolbar-btn-icon"
               src="~assets/icons/ladder_icon_white.png"
               alt="">
        </v-avatar>
      </v-btn>
      <sign-dialog v-if="!isLogin" class="app-bar-btn"/>
      <user-menu v-if="isLogin" class="app-bar-btn"/>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
  import {mapGetters} from 'vuex'
  import SignDialog from '~/components/SignDialog.vue'
  import UserMenu from '~/components/UserMenu'

  export default {
    name: "tool-bar",
    components: {
      SignDialog,
      UserMenu
    },
    methods: {
      toLadderPost() {
        if (this.isLogin) {
          this.$router.push('/post/')
        } else {
          alert("投稿ですか？まずはログインしてください！")
        }
      },
      toLadderManagement() {
        if (this.isLogin) {
          this.$router.push('/ladder/' + this.userId + '/')
        } else {
          alert("ラダーページのご利用はログイン後に可能となります！")
        }
      }
    },
    computed: {
      ...mapGetters('user', {
        isLogin: 'LOGIN_GETTER',
        userId: 'USER_ID_GETTER'
      })
    },
  }
</script>

<style lang="sass" scoped>
  .g-toolbar
    z-index: 300
    background-color: $default_primary_color !important
  .g-toolbar-title
    color: #fff
    display: flex
    align-items: center
    @media(min-width: $media_tablet)
      &:hover
        opacity: .7
  .g-toolbar-logo
    display: inline-block
    vertical-align: middle
    background: url('~assets/images/logo_title_sp.png') no-repeat center
    background-size: contain
    width: 100px
    height: 30px
    @media(min-width: $media_phone)
      max-width: 150px
      width: 150px
  .g-search-wrap
    display: none
    @media(min-width: $media_desktop_sm)
      display: flex
      padding: 10px 0
      margin: 0 0 0 30px
  .g-search-field
    padding: 5px 10px 0
    background: #fff
    border-radius: 30px
    overflow: hidden
  .input-group__details
    display: none
  .g-toolbar-items
    display: none
    @media(min-width: $media_desktop_sm)
      display: flex
  .g-toolbar-btn
    margin: 0 0 0 20px !important
    border: none !important
  .g-toolbar-btn-icon
    max-height: 80%
    max-width: 80%
    width: 100%
  .app-bar-btn
    margin: 0 0 0 20px
</style>
