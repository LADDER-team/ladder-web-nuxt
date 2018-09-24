<template>
  <v-layout justify-center fill-height
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
  import _ from 'underscore'

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
        url: 'https://api.ladder.noframeschools.com/api/ladder/',
        header: {
          'Access-Control-Allow-Origin': '*'
        }
      }).then((response) => {
        return {
          ladderList: _.sortBy(response.data.results, (value) => {
            return -value.id
          })
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    data: () => ({
      chartDialog: false,
      ladderList: []
    }),
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
          url: 'https://api.ladder.noframeschools.com/api/ladder/',
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        }).then((response) => {
          this.ladderList = _.sortBy(response.data.results, (value) => {
            return -value.id
          })
        }).catch((error) => {
          console.log(error)
        })
      }
    },
  }
</script>

<style lang="sass" scoped>
  .ladder-links-wrap
    overflow-y: auto
    display: inline-block
    max-width: 600px
    height: 85%
    &:last-child
      border-bottom: none
  .ladder-link-wrap
    width: 100%
</style>
