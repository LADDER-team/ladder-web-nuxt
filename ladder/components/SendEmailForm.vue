<template>
  <v-card>
    <v-card-title>
      <span class="headline">パスワード再設定</span>
    </v-card-title>
    <v-card-text>
      <v-container grid-list-md>
        <v-layout wrap>
          <v-form lazy-validation
                  ref="form"
                  v-model="valid"
                  @submit.prevent="validateSubmit"
                  class="sign-form">
            <v-text-field
              v-model="modelEmail"
              :rules="emailRules"
              prepend-icon="email"
              ref="emailRef"
              label="メールアドレス"
              required></v-text-field>
          </v-form>
        </v-layout>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn flat color="blue darken-1"
             @click="resetDialog">キャンセル
      </v-btn>
      <v-btn color="blue darken-1" flat
             :disabled="!valid"
             @click="sendEmail">送信する
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  export default {
    name: "send-email-form",
    data: () => ({
      //validation
      valid: false,
      modelEmail: "",
      emailRules: [
        v => !!v || 'メールアドレスを入力してください',
        v => /.+@.+/.test(v) || 'exam@exam.comなどの形式で入力してください'
      ]
    }),
    methods: {
      resetDialog(){
        this.$emit('reset-dialog')
      },
      validateSubmit(){
        if (!this.$refs.form.validate()) {
          return false
        }
      },
      sendEmail() {
        if (this.$refs.form.validate()) {
          // post to api serve
          this.resetDialog()
        } else {
          alert('メールアドレスを入力してください！')
        }
      }
    }
  }
</script>

<style lang="sass" scoped></style>
