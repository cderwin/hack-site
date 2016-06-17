import Vue from 'vue';
import html from './editor.jade';

export default Vue.component('editor',
{
    name: 'editor',
    template: html(),
    props: {
        content: {
            type: String,
            default: ''
        }
    },
    ready() {
        this.$nextTick(() => {

            // Create codemirror instance
            const el = $('#code-textarea')[0];
            this.editor = CodeMirror.fromTextArea(el, {
                value: this.content,
                lineNumbers: true
            });

            // Watch for changes in codemirror and update `content` property
            this.editor.on('change', () => {
                this.$set('content', this.editor.getValue());
            });

            // Watch for updates to the model and update codemirror if necessary
            this.$watch('content', value => {
                if (value != this.editor.getValue())
                    this.editor.setValue(value);
            });

        });
    }
});
