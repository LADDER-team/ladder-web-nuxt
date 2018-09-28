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
    <div v-if="manage" class="ladder-manage-btn-wrap">
      <v-btn slot="activator" flat
             :class="{'public-btn': isPublic, 'private-btn': !isPublic}"
             class="ladder-manage-btn">
        {{isPublic?"公開中":"非公開"}}
      </v-btn>
    </div>
  </div>
</template>

<script>
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
    computed: {
      ...mapGetters('user', {
        token: 'TOKEN_GETTER',
        isLogin: 'LOGIN_GETTER',
        userId: 'USER_ID_GETTER'
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
    padding: 0 75px 0 0

  .ladder-manage-btn-wrap
    position: absolute
    top: 0
    right: 0

</style>
