import Vue from 'vue';
import html from './app.jade';
import store from '../state/store';

export default Vue.extend({
    name: 'App',
    template: html(),
    store
});
