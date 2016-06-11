import {app, error} from '../components';

export default {
    '*': {
        name: 'error',
        component: error
    },

    '/': {
        name: 'app',
        component: app
    }
/*
    '/assembler': {
        name: 'assembler',
        component: assembler
    },

    '/emulator': {
        name: 'emulator',
        compnent: cpu_emulator
    },

    '/hdl': {
        name: 'hdl',
        component: hdl_emulator
    }
*/
}
