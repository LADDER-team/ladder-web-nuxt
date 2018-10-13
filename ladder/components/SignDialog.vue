<template>
  <v-dialog v-model="dialog"
            persistent
            max-width="500">
    <v-btn slot="activator"
           dark round outline small
           class="avatar-btn">
      <v-avatar :size="40">
        <v-icon>person_outline</v-icon>
      </v-avatar>
    </v-btn>
    <transition name="sign-dialog">
      <sign-up-form v-show="sign&&!this.isLogin"
                    v-on:cancel="onCancelDialog"
                    v-on:direct-login="onDirectLogin"
                    v-on:login="receivedLogin"/>
    </transition>
    <transition name="sign-dialog">
      <sign-in-form v-show="login&&!this.isLogin"
                    v-on:cancel="onSignInDialog"
                    v-on:password-reset="onPasswordReset"
                    v-on:login="receivedLogin"/>
    </transition>
    <transition name="sign-dialog">
      <send-email-form v-show="reset&&!this.isLogin"
                       v-on:reset-dialog="onResetDialog"/>
    </transition>
  </v-dialog>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import SendEmailForm from '~/components/SendEmailForm'
  import SignInForm from '~/components/SignInForm'
  import SignUpForm from '~/components/SignUpForm'

  export default {
    name: "sign-dialog",
    components: {
      SignInForm,
      SignUpForm,
      SendEmailForm,
    },
    data: () => ({
      dialog: false,
      login: false,
      sign: true,
      reset: false,
      avatar: "person_outline",
    }),
    mounted() {
      if (this.isLogin) {
        this.sign = false;
      }
    },
    methods: {
      onSignInDialog() {
        this.dialog = false
        setTimeout(() => {
          this.login = false
          this.sign = true
        }, 200)
      },
      onCancelDialog() {
        this.dialog = false
      },
      onDirectLogin() {
        this.sign = false
        setTimeout(() => {
          this.login = true
        }, 350)
      },
      receivedLogin() {
        this.avatar = "face"
        this.dialog = false
      },
      onPasswordReset() {
        this.login = false
        setTimeout(() => {
          this.reset = true
        }, 350)
      },
      onResetDialog(){
        this.dialog = false
        this.reset = false
        setTimeout(() => {
          this.sign = true
        }, 350)
      },
      ...mapActions([
        'user/ADD_TOKEN_ACTION',
        'user/LOGIN_ACTION'
      ])
    },
    computed: {
      ...mapGetters('user', {
        isLogin: 'LOGIN_GETTER',
        token: 'TOKEN_GETTER'
      }),
    },
  }
</script>

<style scoped lang="sass"></style>
