import Vue from 'vue';
import html from './footer.jade';
import { router } from '../initialize';

let store = {
    actions: {},

    addAction(name, data){
        Vue.set(this.actions, name, data);
    },

    removeAction(name){
        Vue.delete(this.actions, name);
    },

    setActions(actions){
        this.removeActions();
        for (let key in actions){
            Vue.set(this.actions, key, actions[key]);
        }
    },

    removeActions(){
        for (let key in this.actions){
            Vue.delete(this.actions, key);
        }
    }
};

export { store as footerStore };


export default Vue.component('appfooter',
{
    name: 'Footer',
    template: html(),
    data: () => ({
        actions: store.actions
    })
});
