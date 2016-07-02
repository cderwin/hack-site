import Vue from 'vue';
import { SET_ACTION, REMOVE_ACTION, CLEAR_ACTIONS } from '../mutation-types';

const state = {
    actions: {}
};

const mutations = {
    [SET_ACTION](state, key, value){
        Vue.set(state.actions, key, value);
    },

    [REMOVE_ACTION](state, key){
        Vue.delete(state.actions, key);
    },

    [CLEAR_ACTIONS](state){
        for (let key in state.actions){
            Vue.delete(state.actions, key);
        }
    }
};

export default { state, mutations };
