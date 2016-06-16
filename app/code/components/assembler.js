import Vue from 'vue';
import html from './assembler.jade';

export default Vue.component('assembler',
{
    name: 'assembler',
    template: html(),
    ready: () => {
        const el = $('.codebox')[0];
        const editor = CodeMirror.fromTextArea(el, {
            lineNumbers: true
        });
    }
});
