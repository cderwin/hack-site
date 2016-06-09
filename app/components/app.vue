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
</style>
