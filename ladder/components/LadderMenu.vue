<template>
  <div class="text-xs-center">
    <v-menu offset-y>
      <v-btn slot="activator"
             dark round outline small
             class="avatar-btn">
        <v-avatar :size="40" class="ladder-menu-wrap">
          <v-icon color="grey">more_vert</v-icon>
        </v-avatar>
      </v-btn>
      <v-list>
        <v-list-tile @click="toEdit">
          <v-list-tile-title>
            ラダーを編集する
          </v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: "ladder-menu",
    props: {
      ladderId: 0,
    },
    methods: {
      toHelp() {
        alert('機能実装をお待ちください！')
      },
      toEdit(){
        this.$router.push({ path: `/ladder/edit/${this.ladderId}/`})
      },
    },
    computed: {
      ...mapGetters('user', {
        userId: 'userIdGetter'
      })
    },
  }
</script>

<style lang="sass" scoped>
  .ladder-menu-wrap
    max-width: 40px
</style>
