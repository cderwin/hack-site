import Vue from 'vue';
import Vuex from 'vuex';
import Logger from 'vuex/logger';

import { environment } from '../initialize';
import { assembler, footer, vm } from './modules';

Vue.use(Vuex);

export default new Vuex.Store({

    strict: (environment !== 'production'),

    modules: {
        assembler,
        footer,
        vm
    },

    middlewares: [
        Logger()
    ]

});
