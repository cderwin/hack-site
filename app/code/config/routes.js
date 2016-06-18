import {assembler, error, root} from '../components';

export default {
    '*': {
        name: 'error',
        component: error
    },

    '/': {
        name: 'ropt',
        component: root
    },

    '/assembler': {
        name: 'assembler',
        component: assembler
    }
/*
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
