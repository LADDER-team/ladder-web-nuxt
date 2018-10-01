<template>
  <div class="text-xs-center">
    <v-menu offset-y>
      <v-btn slot="activator"
             dark round outline small
             class="avatar-btn">
        <v-avatar :size="40" class="user-menu-wrap">
          <v-icon>face</v-icon>
        </v-avatar>
      </v-btn>
      <v-list>
        <v-list-tile @click="toMyPage">
          <v-list-tile-title>
            マイページ
          </v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="toPassword">
          <v-list-tile-title>パスワード再設定</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="toHelp">
          <v-list-tile-title>ヘルプ</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="doLogout">
          <v-list-tile-title>ログアウト</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'

  export default {
    name: "user-menu",
    methods: {
      toHelp() {
        alert('機能実装をお待ちください！')
      },
      toMyPage() {
        const userId = typeof this.userId === 'number' ? this.userId : parseInt(this.userId)
        this.$router.push('/user/' + userId + '/')
      },
      toPassword(){
        this.$router.push('/settings/password/edit/')
      },
      doLogout() {
        localStorage.clear()
        this.LOGOUT_ACTION()
        alert('正常にログアウトされました！TOPへ遷移します！')
        this.$router.push('/')
      },
      ...mapActions('user', [
        'LOGOUT_ACTION'
      ])
    },
    computed: {
      ...mapGetters('user', {
        userId: 'USER_ID_GETTER'
      })
    },
  }
</script>

<style lang="sass" scoped>
  .user-menu-wrap
    max-width: 40px
</style>
