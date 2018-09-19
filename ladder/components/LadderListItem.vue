<template>
  <div class="ladder-link-wrap">
    <router-link :to="{path: `/detail/${ladderId}/`}"
                 class="ladder-link">
      <div class="ladder-thumb-wrap">
        <img src="~assets/images/ladder_avatar.png"
             class="ladder-thumb">
      </div>
      <div :class="{'manage-ladder-wrap': manage}" class="ladder-info-wrap">
        <h2 class="ladder-link-title">{{ title }}</h2>
        <p v-if="0<=count" class="ladder-link-attach">
          学習中: <span>{{ count }}</span>
        </p>
      </div>
    </router-link>
    <v-dialog
      v-if="manage"
      v-model="dialog"
      width="500"
      class="ladder-manage-btn-wrap">
      <v-btn slot="activator" flat
             :class="{'public-btn': isPublic, 'private-btn': !isPublic}"
             class="ladder-manage-btn">
        {{isPublic?"公開中":"非公開"}}
      </v-btn>
      <v-card>
        <v-card-title
          class="headline manage-dialog-title"
          primary-title>
          {{isPublic?"非公開":"公開"}}設定
        </v-card-title>
        <v-card-text v-show="isPublic" class="body-2">
          {{title}} は【公開中】です！<br>
          【非公開】にするとトップの一覧にこのラダーが表示されなくなります！
        </v-card-text>
        <v-card-text v-show="!isPublic" class="body-2">
          {{title}} は【非公開】です！<br>
          【公開中】にするとトップページにこのラダーが表示されるようになります！
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="secondary" flat
            @click="dialog = false">
            キャンセル
          </v-btn>
          <v-btn
            color="primary" flat
            @click="publishLadder">
            {{isPublic?"非公開にする":"公開する"}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  import {mapGetters} from 'vuex'

  export default {
    name: "ladder-list-item",
    props: {
      count: 0,
      ladderId: 0,
      title: "",
      manage: false,
      isPublic: false,
    },
    data: () => ({
      dialog: false,
    }),
    methods: {
      publishLadder() {
        this.dialog = false
        this.$emit('publish-emit')
      }
    },
    computed: {
      ...mapGetters('user', {
        token: 'tokenGetter',
        isLogin: 'loginGetter',
        userId: 'userIdGetter'
      })
    }
  }
</script>

<style lang="sass" scoped>
  .ladder-link-wrap
    position: relative
  .ladder-link
    position: relative
    display: flex
    justify-content: flex-start
    align-items: flex-start
    flex-direction: row
    padding: 10px 20px
    margin: 0
    background-color: #fff
    border-bottom: 1px solid $default_border_color
    width: 100%
    transition: opacity .3s
    &:hover
      opacity: .6
  .ladder-info-wrap
    width: 100%
  .ladder-link-title
    margin: 0 0 10px
    width: 100%
    text-decoration: none
    font-size: 20px
    font-weight: normal
    color: #000
  .ladder-link-attach
    text-decoration: none
    text-align: right
    color: $default_tertiary_color
    font-size: 11px
    span
      font-size: 14px
      color: #000
      margin: 0 0 0 5px
  .ladder-thumb-wrap
    min-width: 50px
    width: 50px
    height: 50px
    margin: 0 20px 0 0
  .ladder-thumb
    max-width: 100%
    width: 100%
    height: 100%

  .manage-ladder-wrap
    display: flex
  .ladder-manage-btn-wrap
    position: absolute
    top: 0
    right: 0
  .manage-dialog-title
    background: $default_primary_color
    color: #fff
</style>
