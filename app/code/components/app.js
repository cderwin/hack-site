import Vue from 'vue';
import Auth from '../utils/auth';
import {router} from '../initialize.js';
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
                callback: () => router.go('/assembler')
            }
        }
    })
});
