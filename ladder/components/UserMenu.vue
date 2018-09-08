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
        <v-list-tile @click="toHelp">
          <v-list-tile-title>ヘルプ</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: "user-menu",
    computed: {
      ...mapGetters('user', {
        userId: 'userIdGetter'
      })
    },
    methods: {
      toHelp(){
        alert('機能実装をお待ちください！')
      },
      toMyPage() {
        this.$router.push('/user/' + this.userId + '/')
      }
    }
  }
</script>

<style lang="sass" scoped>
  .user-menu-wrap
    max-width: 40px
</style>
