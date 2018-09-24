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
        <div @click="clickLadder(0)"
             :class="{'ladder-item-active': isLearning||isLearned}"
             class="ladder-item">
          <p>{{ladderDetailList.title}}</p>
        </div>
        <div v-for="(units, index) in unitList" :key="index"
             @click="clickLadder(index)"
             :class="{'ladder-item-active': isLearning&&!learnedStatus(learningUnits, index)||isLearned}"
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
            <v-btn @click="learnStart"
                   v-show="isWillLearning"
                   class="primary-btn">
              このLadderで学習する
            </v-btn>
            <v-btn @click="learnStart"
                   v-show="isLearning"
                   class="learning-btn">
              このLadderで学習中
            </v-btn>
            <v-btn @click="learnStart"
                   v-show="isLearned"
                   class="learned-btn">
              このLadderは学習済み
            </v-btn>
          </div>
          <ladder-menu :ladderId="ladderId"
                       :user="ladderDetailList.user"/>
        </v-flex>
        <h2 class="unit-title unit-cover-title display-1">{{ladderDetailList.title}}</h2>
        <div class="unit-description">
          <p class="unit-description-text">{{ladderDetailList.ladder_description}}</p>
        </div>
      </div>
      <div v-for="(units, key) in unitList" :key="key"
           class="unit-item">
        <div class="unit-btn-wrap">
          <v-btn @click="learnFinish(key)"
                 v-if="isLearning&&learnedStatus(learningUnits, key)"
                 class="primary-btn unit-btn">
            学習済みにする
          </v-btn>
          <v-btn @click="learnFinish(key)"
                 v-if="isLearning&&!learnedStatus(learningUnits, key)"
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
  import {mapGetters} from 'vuex'
  import _ from 'underscore'
  import LadderMenu from '~/components/LadderMenu'

  export default {
    name: 'ladder-detail',
    layout: 'engineer',
    scrollToTop: true,
    transitions: {
      name: 'page',
      mode: 'out-in'
    },
    async asyncData({params}) {
      const ladderId = params.id
      let ladderDetailList = []
      let unitList = []
      let ladderCreator = ""
      await axios({
        method: 'GET',
        url: 'http://127.0.0.1:8080/api/ladder/' + ladderId + '/'
      }).then((response) => {
        ladderDetailList = response.data
        unitList = _.indexBy(response.data.units, 'index')
      })
      await axios({
        method: 'GET',
        url: 'http://127.0.0.1:8080/api/users/' + ladderDetailList.user + '/'
      }).then((response) => {
        ladderCreator = response.data.name
      })
      return {
        ladderCreator: ladderCreator,
        ladderDetailList: ladderDetailList,
        unitList: unitList,
      }
    },
    data: () => ({
      ladderActive: false,
      ladderToUnit: false,
      duration: 300,
      offsetTop: 0,
      scrollOffset: 0,
      scrollWrapH: 0,
      selectedLadder: 0,
      unitPosition: 0,
      updateId: 0,
      easing: '',
      ladderCreator: '',
      learning: 'willLearning',
      image: {
        src: 'https://s.wordpress.com/mshots/v1/',
        height: 1600,
        width: 1600,
        alt: '画像がないよ！'
      },
      ladderDetailList: [],
      learningList: [],
      learningStatusList: [],
      learningIndexes: [],
      unitList: [],
    }),
    head() {
      return {
        title: this.ladderDetailList.title ? this.ladderDetailList.title : 'Detail'
      }
    },
    components: {LadderMenu},
    created() {
      this.learningIndexes = []
      this.createdLadderDetail()
    },
    mounted() {
      window.addEventListener('scroll', this.handleScroll)
    },
    methods: {
      clickLadder(index) {
        this.duration = 600
        this.easing = 'easeInOutCubic'

        this.$nextTick(() => {
          this.scrollOffset = this.$el.getElementsByClassName('unit-item')[index].offsetTop - 100
          this.$vuetify.goTo('#scroll-wrap', this.options)
        })
      },
      createdLadderDetail() {
        if (Object.keys(this.ladderDetailList).length && Object.keys(this.unitList).length) {
          this.getLadderCreator()
          this.getLearningLadder()
        } else {
          const ladderId = this.$route.params.id
          axios({
            method: 'GET',
            url: 'http://127.0.0.1:8080/api/ladder/' + ladderId + '/'
          }).then((response) => {
            this.ladderDetailList = response.data
            this.unitList = _.indexBy(response.data.units, 'index')
          }).then(() => {
            this.getLadderCreator()
          }).then(() => {
            if (this.isLogin) {
              this.getLearningLadder()
            }
          }).catch((error) => {
            console.log(error)
          })
        }
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
      getLadderCreator() {
        let userId = this.ladderDetailList.user
        axios({
          method: 'GET',
          url: 'http://127.0.0.1:8080/api/users/' + userId + '/'
        }).then((response) => {
          this.ladderCreator = response.data.name
        }).catch((error) => {
          console.log(error)
        })
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
        learningList.some((value, index) => {
          const isLearned = this.learningStatusList[index].status
          if (isLearned) {
            if (this.learningIndexes.indexOf(value.index) === -1) {
              this.learningIndexes.push(value.index)
              return true
            }
          }
        })
      },
      getLearningLadder() {
        this.learningList = []
        if(this.userId){
          axios({
            method: 'GET',
            url: 'http://127.0.0.1:8080/api/users/' + this.userId + '/learning-ladder/'
          }).then((response) => {
            this.learningList = response.data
          }).then(() => {
            this.isFinishLadder()
          }).then(() => {
            if (this.isWillLearning) {
              this.doLearning()
            }
            if (this.isLearning) {
              this.getLearningStatus()
            }
          }).catch((error) => {
            console.log(error)
          })
        }
      },
      getLearningStatus() {
        const ladderId = this.ladderDetailList.id
        const url = this.generatedUrl('http://127.0.0.1:8080/api/learningstatus/', this.userId, ladderId)
        axios({
          method: 'GET',
          url: url
        }).then((response) => {
          const learningStatusList = _.sortBy(response.data.results, (value) => {
            return value.unit
          })
          this.learningStatusList = learningStatusList
        }).then(() => {
          this.getLearningIndexes()
        }).catch((error) => {
          console.log(error)
        })
      },
      generatedUrl(url, user, ladder) {
        let tempUrl = url;
        if (user) {
          tempUrl += `?user=${user}`
        }
        if (!user) {
          tempUrl += `?ladder=${ladder}`
        } else if (ladder) {
          tempUrl += `&&ladder=${ladder}`
        }
        return tempUrl
      },
      handleScroll() {
        this.offsetTop = window.pageYOffset
      },
      isFinishLadder() {
        let thisTitle = this.ladderDetailList.title
        axios({
          method: 'GET',
          url: 'http://127.0.0.1:8080/api/users/' + this.userId + '/finish-ladder/'
        }).then((response) => {
          response.data.forEach((value) => {
            if (value.title === thisTitle) {
              this.learning = 'learned'
              if (this.updateId) {
                alert('学習お疲れ様でした！')
              }
            }
          })
        }).catch((error) => {
          console.log(error)
        })
      },
      async learnFinish(index) {
        const activateId = this.learningStatusList[index - 1].id
        if (activateId) {
          await this.putLearnActivate(activateId)
        }
      },
      learnStart() {
        if(this.isLogin) {
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
        }else{
          alert('学習を始めるにはまずログインです！')
        }
      },
      postLearnInitialize(index) {
        let units = this.unitList
        axios({
          method: 'POST',
          url: 'http://127.0.0.1:8080/api/learningstatus/',
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
          url: 'http://127.0.0.1:8080/api/learningstatus/' + id + '/',
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
    },
    watch: {
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
      ladderId() {
        return this.$route.params.id
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
      createdAtDate() {
        const date = this.ladderDetailList.update_at
        return date ? date.slice(0, 4) + "-" + date.slice(5, 7) + "-" + date.slice(8, 10) : ""
      },
      ...mapGetters('user', {
        isLogin: 'loginGetter',
        token: 'tokenGetter',
        userId: 'userIdGetter'
      })
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
        box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12)
  .unit-image
    margin: 0 auto
    box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)
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
    background-color: rgba(207, 216, 220, .5)
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
