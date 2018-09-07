<template>
  <v-layout md8 lg8
            justify-center
            class="layout-ladder-list">
    <v-flex align-start　justify-center
            class="ladder-links-wrap">
      <div v-for="(ladder, index) in ladderList" :key="index"
           class="ladder-link-wrap">
        <router-link :to="{path: `/detail`, query: {id: ladder.id}}"
                     class="ladder-link">
          <div class="ladder-thumb-wrap">
            <img src="~assets/images/ladder_avatar.png"
                 class="ladder-thumb">
          </div>
          <div class="ladder-info-wrap">
            <h2 class="ladder-link-title">{{ ladder.title }}</h2>
            <p class="ladder-link-attach">
              学習中: <span>{{ ladder.count_learning_number }}</span>
            </p>
          </div>
        </router-link>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
  import axios from 'axios'

  export default {
    name: "ladder-list",
    layout: 'engineer',
    scrollToTop: true,
    asyncData() {
      return axios({
        method: 'GET',
        url: 'https://api.ladder.noframeschools.com/api/ladder/'
      }).then((response) => {
        return {ladderList: response.data.results}
      }).catch((e) => {
        error({statusCode: 404, message: 'Not Found...'})
      })
    },
    data() {
      return {
        chartDialog: false,
        ladderList: []
      }
    },
    mounted() {
      if (!this.ladderList.length) {
        axios({
          method: 'GET',
          url: 'https://api.ladder.noframeschools.com/api/ladder/'
        }).then((response) => {
          this.ladderList = response.data.results
        }).catch((error) => {
          console.log(error)
        })
      }
    },
  }
</script>

<style lang="sass" scoped>
  .ladder-links-wrap
    display: inline-block
    &:last-child
      border-bottom: none
  .ladder-link
    display: flex
    justify-content: flex-start
    align-items: flex-start
    flex-direction: row
    padding: 10px 20px
    margin: 0
    background-color: #fff
    border-bottom: 1px solid $default_border_color
    width: 100%
    &:hover
      opacity: .7
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
</style>
