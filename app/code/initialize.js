import 'babel-polyfill';

import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import VueValidator from 'vue-validator';

import store from './state/store';
import routes from './config/routes';
import { app } from './components';
import { footerStore } from './components/footer.js';

Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(VueValidator);

const environment = process.env.NODE_ENV;
Vue.config.debug = (environment === 'development');
Vue.config.devtools = (environment === 'development');

// Router

export let router = new VueRouter({
    history: true
});

router.beforeEach(() => footerStore.removeActions()); 

router.map(routes);
router.start(app, '#content', () => {
    window.App = router.app;
});
