import Vue from 'vue';
import html from './app.jade';
import store from '../vuex/store';

export default Vue.extend({
    name: 'App',
    template: html(),
    store
});
