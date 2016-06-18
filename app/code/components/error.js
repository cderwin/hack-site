import Vue from 'vue';
import { router } from '../initialize.js';
import html from './error.jade';
import { footerStore } from './footer.js';

export default {
    name: 'Error',
    template: html(),

    props: {
        path: {
            type: String,
            required: false
        }
    },

    created() {
        const route = this.$route;
        this.path = route.path;
    },

    ready(){
        footerStore.setActions({
            home: {
                name: 'Home',
                callback: () => router.go('/')
            }
        });
    }
}
