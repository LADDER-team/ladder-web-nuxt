<template>
  <v-layout align-start justify-center wrap
            ref="scrollWrapRef"
            id="scroll-wrap"
            class="layout-ladder-detail">
    <v-flex md2 lg2
            align-cener
            justify-center
            class="ladder-wrap">
      <div id="ladder-action-wrap" class="ladder-inner">
        <div @click="clickLadder"
             :class="{'ladder-item-active': false}"
             class="ladder-item">
          <p>{{ladderDetailList.title}}</p>
        </div>
        <div v-for="(units, key) in unitList" :key="key"
             @click="clickLadder"
             :class="{'ladder-item-active': false}"
             class="ladder-item">
          <p>unit:{{ units.index }}</p>
          <p>{{ units.title }}</p>
        </div>
      </div>
    </v-flex>
    <v-flex md7 lg7 align-start justify-center
            id="unit-items"
            class="unit-wrap">
      <div class="unit-item">
        <v-flex layout row class="unit-cover-info-wrap">
          <v-avatar tile :size=40 class="unit-cover-avatar">
            <img src="~assets/images/ladder_avatar.png" alt="avatar">
          </v-avatar>
          <div class="unit-cover-info">
            <p class="unit-cover-info-name subheading">{{ladderCreator}}</p>
            <p class="unit-cover-info-date body-1">
              {{createdAtDate}}に更新
            </p>
          </div>
          <div class="unit-cover-btn-wrap">
            <v-btn @click="clickLearnStart"
                   v-show="true"
                   class="primary-btn">
              このLadderで学習する
            </v-btn>
            <v-btn @click="clickLearnStart"
                   v-show="false"
                   class="learning-btn">
              このLadderで学習中
            </v-btn>
            <v-btn @click="clickLearnStart"
                   v-show="false"
                   class="learned-btn">
              このLadderは学習済み
            </v-btn>
          </div>
        </v-flex>
        <h2 class="unit-title unit-cover-title display-1">{{ladderDetailList.title}}</h2>
        <div class="unit-description">
          <p class="unit-description-text">{{ladderDetailList.ladder_description}}</p>
        </div>
      </div>
      <div v-for="(units, key) in unitList" :key="key"
           class="unit-item">
        <div class="unit-btn-wrap">
          <v-btn @click="clickLearnEnd"
                 v-if="true"
                 class="primary-btn unit-btn">
            学習済みにする
          </v-btn>
          <v-btn @click="clickLearnEnd"
                 v-if="false"
                 class="learned-btn unit-btn">
            学習済みです！
          </v-btn>
        </div>
        <h2 class="unit-title display-1">{{ units.title }}</h2>
        <v-flex align-center justify-center
                class="unit-image-wrap">
          <a :href="units.url" target="_blank">
            <img :src="image.src+units.url+'?w='+image.width+'&h='+image.height+'?'"
                 :alt="image.alt"
                 class="unit-image">
          </a>
        </v-flex>
        <div class="unit-description">
          {{ units.description }}
        </div>
      </div>
    </v-flex>
  </v-layout>
</template>
<script>
  import axios from 'axios'
  import _ from 'underscore'

  export default {
    name: 'ladder-detail',
    layout: 'engineer',
    scrollToTop: true,
    transitions: {
      name: 'page',
      mode: 'out-in'
    },
    asyncData(){},
    data: () => ({
      ladderActive: false,
      ladderToUnit: false,
      nextLadder: false,
      prevLadder: false,
      learning: 'willLearning',
      nextLadderId: null,
      ladderParam: null,
      prevLadderId: null,
      duration: 300,
      offsetTop: 0,
      scrollWrapH: 0,
      selectedLadder: 0,
      scrollOffset: 0,
      unitH: 0,
      unitPosition: 0,
      unitScroll: 0,
      unitActivate: 0,
      updateId: 0,
      easing: '',
      ladderCreator: '',
      ladderUpdated: {
        year: '',
        month: '',
        day: '',
      },
      url: 'https://blinky.nemui.org/shot/xlarge?',
      image: {
        src: 'https://s.wordpress.com/mshots/v1/',
        height: 1600,
        width: 1600,
        alt: '画像がないよ！'
      },
      ladderDetailList: [],
      unitList: [],
      nextLadderList: [],
      prevLadderList: [],
      learningList: [],
      learningStatusList: [],
      learningIndexes: [],
      finishLadderList: [],
    }),
    created() {
      this.ladderParam = this.$route.query.id
      this.learningIndexes = []
      this.createdLadderDetail()
    },
    mounted() {
      window.addEventListener('scroll', this.handleScroll)
    },
    methods: {
      handleScroll() {
        this.offsetTop = window.pageYOffset
      },
      clickLadder(e) {
        this.duration = 600
        this.easing = 'easeInOutCubic'
        let index = this.findIndex(e, '.ladder-item')

        this.$nextTick(() => {
          this.scrollOffset = this.$el.getElementsByClassName('unit-item')[index].offsetTop - 100
          this.$vuetify.goTo('#scroll-wrap', this.options)
        })
      },
      createdLadderDetail() {
        axios({
          method: 'GET',
          url: 'https://api.ladder.noframeschools.com/api/ladder/' + this.ladderParam + '/'
        }).then((response) => {
          this.ladderDetailList = response.data
          this.unitList = response.data.units
        }).then(() => {
          this.unitList = _.indexBy(this.unitList, 'index')
        }).then(() => {
          this.createLadderDate(this.ladderDetailList.update_at)
        }).then(() => {
          this.getLadderCreator()
        }).then(() => {
          // this.getLearningLadder()
        }).catch((error) => {
          console.log(error)
        })
      },
      findIndex(e, className, needParent) {
        let nodeList = document.querySelectorAll(className)
        let target = null;
        target = needParent ? e.target.parentNode : e.target
        return Array.prototype.indexOf.call(nodeList, target)
      },
      clickLearnStart() {
        if (this.isWillLearning || this.learningList === 0) {
          let list = this.unitList
          for (let index in list) {
            setTimeout(() => {
              this.postLearnInitialize(index)
            }, 100)
          }
        } else if (this.isLearning) {
          alert('学習ファイトです！')
        } else {
          alert('学習お疲れ様でした！')
        }
      },
      postLearnInitialize(index) {
        let units = this.unitList
        axios({
          method: 'POST',
          url: 'https://api.ladder.noframeschools.com/api/learningstatus/',
          headers: {
            "Accept": "application/json",
            "Authorization": "JWT " + this.token,
            "Content-type": "application/json"
          },
          data: {
            unit: units[index].id,
            status: false
          }
        }).then(() => {
          this.learning = 'learning'
        }).catch((error) => {
          console.log(error)
        })
      },
      putLearnActivate(id) {
        axios({
          method: 'PUT',
          url: 'https://api.ladder.noframeschools.com/api/learningstatus/' + id + '/',
          headers: {
            "Accept": "application/json",
            "Authorization": "JWT " + this.token,
            "Content-type": "application/json"
          },
          data: {
            status: true
          },
        }).then(() => {
          this.updateId = Math.random()
        }).catch((error) => {
          console.log(error)
        })
      },
      findLearnActivateId(index) {
        let list = []
        let units = this.unitList
        let unitIndex = units[index].id
        let learningStatusList = []

        learningStatusList = _.sortBy(this.learningStatusList, (value) => {
          return value.id
        })
        learningStatusList.forEach((value) => {
          if (value.unit === unitIndex) {
            list.push(value)
          }
        })
        return list.length ? list[0].id : false
      },
      getLadderCreator() {
        let userId = this.ladderDetailList.user
        axios({
          method: 'GET',
          url: 'https://api.ladder.noframeschools.com/api/users/' + userId + '/'
        }).then((response) => {
          this.ladderCreator = response.data.name
        }).catch((error) => {
          console.log(error)
        })
      },
      createLadderDate(date) {
        date = date.toString()
        this.ladderUpdated.year = date.slice(0, 4)
        this.ladderUpdated.month = date.slice(5, 7)
        this.ladderUpdated.day = date.slice(8, 10)
      },
      getLearningLadder() {
        this.learningList = []
        let userId = this.userId
        axios({
          method: 'GET',
          url: 'https://api.ladder.noframeschools.com/api/users/' + userId + '/learning-ladder/'
        }).then((response) => {
          this.learningList = response.data
        }).then(() => {
          this.isFinishLadder()
        }).then(() => {
          if (this.isWillLearning) {
            this.doLearning()
          }
        }).then(() => {
          if (this.isLearning) {
            this.getLearningStatus()
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      isFinishLadder() {
        let id = this.userId
        let thisTitle = this.ladderDetailList.title
        axios({
          method: 'GET',
          url: 'https://api.ladder.noframeschools.com/api/users/' + id + '/finish-ladder/'
        }).then((response) => {
          response.data.forEach((value) => {
            if (value.title === thisTitle) {
              this.learning = 'learned'
              if(this.updateId){alert('学習お疲れ様でした！')}
            }
          })
        }).catch((error) => {
          console.log(error)
        })
      },
      doLearning() {
        let learningList = this.learningList,
          ladderTitle = this.ladderDetailList.title
        learningList.map((value) => {
          if (value.title === ladderTitle) {
            this.learning = 'learning'
          }
        })
      },
      getLearningStatus() {
        let learningStatusList = []
        axios({
          method: 'GET',
          url: 'https://api.ladder.noframeschools.com/api/learningstatus/'
        }).then((response) => {
          response.data.results.forEach((value) => {
            if (value.user === this.userId) {
              learningStatusList.push(value)
            }
          })
          this.learningStatusList = learningStatusList
        }).then(()=>{
          this.getLearningIndexes()
        }).catch((error) => {
          console.log(error)
        })
      },
      clickLearnEnd(e) {
        let index = this.findIndex(e, '.unit-btn', true) + 1
        let activateId = this.findLearnActivateId(index)
        this.putLearnActivate(activateId)
      },
      getIsLearning(activateId) {
        let learningStatusList = this.learningStatusList
        let isLearned = false
        learningStatusList = _.sortBy(this.learningStatusList, (value) => {
          return value.unit
        })
        learningStatusList.forEach((value) => {
          if (value.id === activateId) {
            isLearned = value.status
          }
        })
        return isLearned
      },
      getLearningIndexes() {
        let title = this.ladderDetailList.title
        let learningList = [];
        this.learningList.forEach((value) => {
          if (title === value.title) {
            learningList = value.units
          }
        })
        learningList = _.sortBy(learningList, (value) => {
          return value.id
        })
        learningList.forEach((value, index) => {
          let activateId = this.findLearnActivateId(index + 1)
          let isLearned = this.getIsLearning(activateId)
          if (isLearned) {
            this.learningIndexes.push(value.index)
          }
        })
      },
    },
    watch: {
      offsetTop: {
        handler() {
          if (this.offsetTop < 100 && this.prevLadderList.length !== 0) {
            this.prevLadder = true
          }
          else if (this.offsetTop > this.scrollWrapH - window.innerHeight * 0.9 - 200 && this.nextLadderList.length !== 0) {
            this.nextLadder = true
          }
          else {
            this.prevLadder = false
            this.nextLadder = false
          }
        }
      },
      ladderDetailList: {
        handler() {
          this.$nextTick(() => {
            this.scrollWrapH = this.$refs.scrollWrapRef.getBoundingClientRect().height
          })
        }
      },
      updateId: {
        handler() {
          this.getLearningLadder()
        }
      },
      learning: {
        handler() {
          this.getLearningStatus()
        }
      },
    },
    computed: {
      options() {
        return {
          duration: this.duration,
          offset: this.scrollOffset,
          easing: this.easing
        }
      },
      learnedStatus() {
        return (array, key) => {
          return array.indexOf(parseInt(key)) === -1
        }
      },
      learningUnits() {
        return this.learningIndexes
      },
      isWillLearning() {
        return this.learning === 'willLearning'
      },
      isLearning() {
        return this.learning === 'learning'
      },
      isLearned() {
        return this.learning === 'learned'
      },
      createdAtDate(){
        const date = this.ladderDetailList.update_at
        const createdAtDate = date?date.slice(0, 4) + "-" + date.slice(5, 7) + "-" + date.slice(8, 10):""
        return createdAtDate
      },
    }
  }
</script>
<style scoped lang="sass">
  .unit-wrap
    position: relative
    align-items: flex-start
    margin: 0 0 0 4%
    max-width: 800px
  .unit-head
    margin: 0 0 20px
    font-size: 18px
    color: #B0BEC5
  .unit-item
    padding: 20px 30px 40px
    margin: 0 0 60px
    height: 90vh
    background: #fff
  .unit-title
    margin: 0 0 30px
    text-align: center
    font-size: 28px
  .unit-point
    text-align: center
  .unit-point-item
    background: #ECEFF1
    padding: 5px 10px
  .unit-image-wrap
    margin: 40px auto
    max-width: 800px
    text-align: center
    a:hover
      .unit-image
        box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2),0px 6px 10px 0px rgba(0, 0, 0, 0.14),0px 1px 18px 0px rgba(0, 0, 0, 0.12)
  .unit-image
    margin: 0 auto
    box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2),0px 2px 2px 0px rgba(0, 0, 0, 0.14),0px 3px 1px -2px rgba(0, 0, 0, 0.12)
    max-width: 60%
    transition: .4s all
    width: 60%
  .unit-description
    font-size: 18px
    border-left: 3px solid #64B5F6
    padding: 0 0 0 10px
    width: 80%
    margin: 0 auto
  .ladder-item
    position: relative
    background: $default_ladder_disable_color
    padding: 10px
    border-bottom: 1px solid #546E7A
    cursor: pointer
    &:hover
      opacity: .7
    p
      margin: 0
      color: #fff
      font-weight: bold
      pointer-events: none
    &:first-of-type
      background-color: $default_ladder_first_color
      &:after
        content: ''
        position: absolute
        top: -40px
        left: 0
        display: inline-block
        width: 6px
        height: 40px
        background: $default_ladder_first_color
      &:before
        content: ''
        position: absolute
        top: -40px
        right: 0
        display: inline-block
        width: 6px
        height: 40px
        background: $default_ladder_first_color
    &:last-of-type
      border-bottom: none
      &:after
        content: ''
        position: absolute
        bottom: -40px
        left: 0
        display: inline-block
        width: 6px
        height: 40px
        background: $default_ladder_disable_color
      &:before
        content: ''
        position: absolute
        bottom: -40px
        right: 0
        display: inline-block
        width: 6px
        height: 40px
        background: $default_ladder_disable_color
  .ladder-wrap
  .ladder-inner
    position: fixed
    top: 25%
    max-width: inherit
    width: 100%
  .ladder-item-active
    background: $default_ladder_activate_color
    &:first-of-type
      background-color: $default_ladder_first_activate_color
      &:after
        content: ''
        position: absolute
        top: -40px
        left: 0
        display: inline-block
        width: 6px
        height: 40px
        background: $default_ladder_first_activate_color
      &:before
        content: ''
        position: absolute
        top: -40px
        right: 0
        display: inline-block
        width: 6px
        height: 40px
        background: $default_ladder_first_activate_color
    &:last-of-type
      border-bottom: none
      &:after
        content: ''
        position: absolute
        bottom: -40px
        left: 0
        display: inline-block
        width: 6px
        height: 40px
        background: $default_ladder_activate_color
      &:before
        content: ''
        position: absolute
        bottom: -40px
        right: 0
        display: inline-block
        width: 6px
        height: 40px
        background: $default_ladder_activate_color

  .peg-link
    z-index: 100
    position: fixed
    top: 65px
    left: 30%
    padding: 10px 50px
    max-height: 120px
    background-color: rgba(207,216,220 ,.5)
    max-width: 900px
    width: 60%
    height: 120px
    &:hover
      opacity: .7
  .peg-link-catch
    margin: 0 0 10px
    text-align: center
    font-size: 18px
    font-weight: normal
  .peg-link-icon
    margin: 0 15px 0 0
  .peg-link-title
    font-size: 30px
    text-align: left
    span
      vertical-align: super

  .unit-cover
    padding: 20px 30px 40px
  .unit-cover-avatar
    border: 1px solid $default_border_color
  .unit-cover-info-wrap
    margin: 0 0 10vh
  .unit-cover-info
    margin: 0 0 0 10px
    white-space: nowrap
  .unit-cover-info-date
    color: $default_small_text_color
    white-space: nowrap
  .unit-cover-btn-wrap
    margin: 0 0 0 auto
  .unit-cover-title
    margin: 0 0 10vh
  .unit-description-text
    font-size: 18px

  .unit-btn-wrap
    margin: 0 0 8vh
    padding: 7px 0
    text-align: right

</style>
