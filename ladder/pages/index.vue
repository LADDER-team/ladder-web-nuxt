<template>
  <v-layout md8 lg8
            justify-center
            class="layout-ladder-list">
    <v-flex align-start　justify-center
            class="ladder-links-wrap">
      <div class="ladder-link-wrap">
        <router-link :to="`/detail/1/`"
                     class="ladder-link">
          <div class="ladder-thumb-wrap">
            <img alt="defaultImage.alt"
                 src="~assets/images/ladder_avatar.png"
                 class="ladder-thumb">
          </div>
          <div class="ladder-info-wrap">
            <h2 class="ladder-link-title">タイトル</h2>
            <p class="ladder-link-attach">
              学習中: <span>99</span>
            </p>
          </div>
        </router-link>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    name: "ladder-list",
    layout: 'engineer',
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
