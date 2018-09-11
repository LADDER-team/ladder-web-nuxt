<template>
  <v-layout md8 lg8
            justify-center
            class="layout-ladder-list">
    <v-flex align-start　justify-center
            class="ladder-links-wrap">
      <div v-for="(ladder, index) in ladderList" :key="index"
           class="ladder-link-wrap">
        <ladder-list-item :ladderId="ladder.id"
                          :title="ladder.title"
                          :count="ladder.count_learning_number"/>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
  import axios from 'axios'
  import LadderListItem from '~/components/LadderListItem'

  export default {
    name: "ladder-list",
    layout: 'engineer',
    scrollToTop: true,
    transitions: {
      name: 'page',
      mode: 'out-in'
    },
    asyncData() {
      return axios({
        method: 'GET',
        url: 'https://api.ladder.noframeschools.com/api/ladder/'
      }).then((response) => {
        return {ladderList: response.data.results}
      }).catch((e) => {
        console.log(e)
      })
    },
    data() {
      return {
        chartDialog: false,
        ladderList: []
      }
    },
    head() {
      return {
        title: 'Top'
      }
    },
    components: {
      LadderListItem
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
</style>
