import Vue from 'vue';
import { router } from '../initialize.js';
import html from './root.jade';
import { footerStore } from './footer.js';

export default Vue.component('root', {
    name: 'App',
    template: html(),
    ready: () => {
        footerStore.setActions({
            assembler: {
                name: 'Assembler',
                callback: () => router.go('/assembler')
            }
        });
    },
    vuex: {
        getters: {
            token: state => state.auth.token
        }
    }
});
