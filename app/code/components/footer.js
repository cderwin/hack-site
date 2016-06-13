import Vue from 'vue';
import html from './footer.jade';

export default Vue.component('appfooter',
{
    name: 'Footer',
    template: html(),
    props: {
        actions: {
            type: Object,
            required: false
        }
    }
});
