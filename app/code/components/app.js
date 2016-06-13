import Vue from 'vue';
import Auth from '../utils/auth';
import html from './app.jade';

export default Vue.component('app', {
    name: 'App',
    template: html(),
    vuex: {
        state: {
            token: state => state.auth.token
        }
    },
    data: () => ({
        actions: {
            assembler: {
                name: 'Assembler',
                callback: () => location.href = '/assembler'
            }
        }
    }),
    created: () => Auth.signin('username', 'password')
});
