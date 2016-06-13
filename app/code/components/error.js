import Vue from 'vue';
import html from './error.jade';

export default {
    name: 'Error',
    template: html(),
    props: {
        path: {
            type: String,
            required: false
        }
    },
    data: () => ({
        actions: {
            refresh: {
                name: 'Home',
                callback : () => location.href = '/'
            }
        }
    }),
    created() {
        const route = this.$route;
        this.path = route.path;
    }
}
