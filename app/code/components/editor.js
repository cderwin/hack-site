import Vue from 'vue';
import html from './editor.jade';

export default Vue.component('editor',
{
    name: 'editor',
    template: html(),
    props: ['highlighter'],
    ready: () => {
        const el = $('#code-textarea')[0];
        const editor = CodeMirror.fromTextArea(el, {
            lineNumbers: true
        });
    }
});
