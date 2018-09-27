<template>
  <v-layout align-start justify-center wrap
            ref="scrollWrapRef"
            id="scroll-wrap"
            class="layout-ladder-detail">
    <v-flex md2 lg2
            :class="{'ladder-wrap-show': isShowLadder}"
            class="ladder-wrap">
      <div id="ladder-action-wrap" class="ladder-inner">
        <div @click="clickLadder(0, isShowLadder)"
             :class="{'ladder-item-active': isLearning||isLearned}"
             class="ladder-item">
          <p>{{ladderDetailList.title}}</p>
        </div>
        <div v-for="(units, index) in unitList" :key="index"
             @click="clickLadder(index, isShowLadder)"
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
      <div class="unit-item unit-cover">
        <v-flex layout row class="unit-cover-info-wrap">
          <v-avatar tile :size=40 class="unit-cover-avatar">
            <img src="~assets/images/ladder_avatar.png" alt="avatar">
          </v-avatar>
          <div class="unit-cover-info">
            <p class="unit-cover-info-name">{{ladderCreator}}</p>
            <p class="unit-cover-info-date">
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
                       :user="ladderDetailList.user"
                       class="ladder-menu"/>
        </v-flex>
        <h2 class="unit-title unit-cover-title">{{ladderDetailList.title}}</h2>
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
        <h3 class="unit-title">{{ units.title }}</h3>
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
    <v-btn dark fab midium
           @click="showLadder"
           class="contribution-floating-btn ladder-activate-btn">
      <img class="ladder-activate-btn-image" src="~static/icons/ladder_icon_white.png" alt="">
    </v-btn>
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
        url: 'http://localhost:8080/api/ladder/' + ladderId + '/'
      }).then((response) => {
        ladderDetailList = response.data
        unitList = _.indexBy(response.data.units, 'index')
      })
      await axios({
        method: 'GET',
        url: 'http://localhost:8080/api/users/' + ladderDetailList.user + '/'
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
      isShowLadder: false,
      duration: 600,
      offsetTop: 0,
      scrollOffset: 0,
      scrollWrapH: 0,
      selectedLadder: 0,
      unitPosition: 0,
      updateId: 0,
      easing: 'easeInOutCubic',
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
      clickLadder(index, isMobile) {
        const offsetDiff = isMobile ? 80 : 100
        this.$nextTick(() => {
          this.scrollOffset = this.$el.getElementsByClassName('unit-item')[index].offsetTop - offsetDiff
          this.$vuetify.goTo('#scroll-wrap', this.options)
        })
        this.isShowLadder = false
      },
      createdLadderDetail() {
        if (Object.keys(this.ladderDetailList).length && Object.keys(this.unitList).length) {
          this.getLadderCreator()
          this.getLearningLadder()
        } else {
          const ladderId = this.$route.params.id
          axios({
            method: 'GET',
            url: 'http://localhost:8080/api/ladder/' + ladderId + '/'
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
          url: 'http://localhost:8080/api/users/' + userId + '/'
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
        if (this.userId) {
          axios({
            method: 'GET',
            url: 'http://localhost:8080/api/users/' + this.userId + '/learning-ladder/'
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
        const url = this.generatedUrl('http://localhost:8080/api/learningstatus/', this.userId, ladderId)
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
          url: 'http://localhost:8080/api/users/' + this.userId + '/finish-ladder/'
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
      showLadder() {
        this.isShowLadder = !this.isShowLadder
      },
      async learnFinish(index) {
        const activateId = this.learningStatusList[index - 1].id
        if (activateId) {
          await this.putLearnActivate(activateId)
        }
      },
      learnStart() {
        if (this.isLogin) {
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
        } else {
          alert('学習を始めるにはまずログインです！')
        }
      },
      postLearnInitialize(index) {
        let units = this.unitList
        axios({
          method: 'POST',
          url: 'http://localhost:8080/api/learningstatus/',
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
          url: 'http://localhost:8080/api/learningstatus/' + id + '/',
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
    @media (min-width: $media_desktop_sm)
      margin: 0 0 0 4%
      max-width: 800px
  .unit-head
    margin: 0 0 20px
    font-size: 18px
    color: #B0BEC5
  .unit-item
    padding: 40px 15px 15px
    margin: 0 0 30px
    height: 90vh
    background: #fff
    box-shadow: $default_shadow_card
    border-radius: 16px
    @media (min-width: $media_desktop_sm)
      padding: 20px 30px 40px
      margin: 0 0 60px
      box-shadow: none
  .unit-title
    margin: 0 0 30px
    text-align: center
    font-size: 24px
    font-weight: 400
    @media (min-width: $media_desktop_sm)
      margin: 0 0 30px
      text-align: center
      font-size: 32px
  .unit-point
    text-align: center
  .unit-point-item
    padding: 5px 10px
    background: #ECEFF1
  .unit-image-wrap
    width: 100%
    margin: 0 auto 30px
    text-align: center
    @media (min-width: $media_desktop_sm)
      margin: 40px auto
      max-width: 800px
      a:hover
        .unit-image
          box-shadow: $default_shadow_image_hover
  .unit-image
    margin: 0 auto
    width: 80%
    box-shadow: $default_shadow_image
    @media (min-width: $media_desktop_sm)
      transition: .4s all
      box-shadow: $default_shadow_image
      max-width: 60%
      width: 60%
  .unit-description
    font-size: 14px
    border-left: 3px solid #64B5F6
    padding: 0 0 0 10px
    width: 90%
    margin: 0 auto
    @media(min-width: $media_desktop_sm)
      font-size: 18px
      padding: 0 0 0 10px
      width: 80%

  .ladder-wrap
    z-index: 100
    position: fixed
    top: -100%
    display: flex
    align-items: center
    justify-content: center
    width: 100vw
    height: 100vh
    opacity: 0
    background-color: rgba(0, 0, 0, .5)
    transition: all 1s
    @media (min-width: $media_desktop_sm)
      position: relative
      top: 0
      width: auto
      height: auto
      opacity: 1
      background: none
  .ladder-wrap-show
    top: 0
    opacity: 1
  .ladder-item
    position: relative
    padding: 6px 10px
    background: $default_ladder_disable_color
    border-bottom: 1px solid #546E7A
    cursor: pointer
    @media(min-width: $media_desktop_sm)
      padding: 10px
      &:hover
        opacity: .7
    p
      margin: 0
      overflow: hidden
      text-overflow: ellipsis
      white-space: nowrap
      font-weight: bold
      color: #fff
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
  .ladder-inner
    position: relative
    top: 0
    width: 70%
    @media (min-width: $media_desktop_sm)
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

  .ladder-menu
    display: none
    @media (min-width: $media_desktop_sm)
      display: block

  .unit-cover
    padding-top: 20px
  .unit-cover-avatar
    border: 1px solid $default_border_color
  .unit-cover-info-wrap
    margin: 0 0 10vh
  .unit-cover-info
    margin: 0 0 0 10px
    white-space: nowrap
  .unit-cover-info-name
    font-size: 14px
    font-weight: 400
    @media (min-width: $media_desktop_sm)
      font-size: 16px
  .unit-cover-info-date
    white-space: nowrap
    font-size: 12px
    font-weight: 400
    color: $default_small_text_color
    @media (min-width: $media_desktop_sm)
      font-size: 14px
  .unit-cover-btn-wrap
    display: none
    @media (min-width: $media_desktop_sm)
      display: block
      margin: 0 0 0 auto
  .unit-cover-title
    margin: 0 0 5vh
    @media (min-width: $media_desktop_sm)
      margin: 0 0 10vh
  .unit-description-text
    font-size: 14px
    @media (min-width: $media_desktop_sm)
      font-size: 18px
  .unit-btn-wrap
    display: none
    @media (min-width: $media_desktop_sm)
      display: block
      padding: 7px 0
      margin: 0 0 8vh
      text-align: right

  .ladder-activate-btn
    z-index: 100
    position: fixed
    bottom: 8px
    right: 8px
    @media (min-width: $media_desktop_sm)
      display: none
  .ladder-activate-btn-image
    width: 80%
    height: 80%
    opacity: .9

</style>
