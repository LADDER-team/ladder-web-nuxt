<template>
  <v-footer app class="g-footer">
    <span class="g-footer-text">&copy; Ladder</span>
  </v-footer>
</template>
<style scoped lang="sass">
  .g-footer
    display: none
    @media (min-width: $media_desktop_sm)
      background: $default_secondary_color !important
  .g-footer-text
    font-size: 12px
    margin: 0 auto
    color: $default_footer_text_color
</style>
