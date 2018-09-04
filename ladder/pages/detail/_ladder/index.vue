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
        <div :class="{'ladder-item-active': false}"
             class="ladder-item">
          <p>title</p>
        </div>
        <div :class="{'ladder-item-active': false}"
             class="ladder-item">
          <p>unit:0</p>
          <p>title</p>
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
            <p class="unit-cover-info-name subheading">tetty</p>
            <p class="unit-cover-info-date body-1">
              2000-01-01に更新
            </p>
          </div>
          <div class="unit-cover-btn-wrap">
            <v-btn v-show="true" class="primary-btn">
              このLadderで学習する
            </v-btn>
            <v-btn v-show="false" class="learning-btn">
              このLadderで学習中
            </v-btn>
            <v-btn v-show="false" class="learned-btn">
              このLadderは学習済み
            </v-btn>
          </div>
        </v-flex>
        <h2 class="unit-title unit-cover-title display-1">title</h2>
        <div class="unit-description">
          <p class="unit-description-text">description</p>
        </div>
      </div>
      <div class="unit-item">
        <div class="unit-btn-wrap">
          <v-btn v-if="true" class="primary-btn unit-btn">
            学習済みにする
          </v-btn>
          <v-btn v-if="false" class="learned-btn unit-btn">
            学習済みです！
          </v-btn>
        </div>
        <h2 class="unit-title display-1">unit title</h2>
        <v-flex align-center justify-center
                class="unit-image-wrap">
          <a href="https://www.google.co.jp" target="_blank">
            <img src="https://s.wordpress.com/mshots/v1/https://www.google.co.jp?w=1600&h=1600"
                 class="unit-image">
          </a>
        </v-flex>
        <div class="unit-description">
          description
        </div>
      </div>
    </v-flex>
  </v-layout>
</template>
<script>
  export default {
    name: 'ladder_detail',
    layout: 'engineer'
  }
</script>
<style lang="sass" scoped>
  .unit-wrap
    position: relative
    align-items: flex-start
    margin: 0 0 0 4%
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
