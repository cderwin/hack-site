<template lang="jade">

  .app
    h1 Hello World!
    p(v-if='token') You are authenticated with the following token #[strong {{token}}]

</template>

<script>

    import Auth from '../utils/auth';

    export default {

        name: 'App',

        vuex: {
            state: {
                token: state => state.auth.token
            }
        },

        created() {
            Auth.signin('username', 'password');
        }
    }

</script>

<style lang="stylus">

cream = #F8F8FF
dark-blue = #0B3C5D
light-blue = #328CC1
gold = #D9B310
ivory = #1D2731

body
  background-color: cream

</style>
