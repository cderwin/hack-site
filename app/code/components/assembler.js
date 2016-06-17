import Vue from 'vue';
import html from './assembler.jade';
import assemble from '../utils/assembler.js';

export default Vue.component('assembler',
{
    name: 'assembler',
    template: html(),
    data() {
        return {
            editorContent: '',
            instructions: [],
            actions: {
                assemble: {
                    name: 'Assemble',
                    callback: this.assemble
                },
                run: {
                    name: 'Run',
                    callback: this.run
                }
            }
        };
    },
    methods: {
        assemble() {
            const assembly = this.editorContent;
            this.instructions = assemble(assembly);
        }
    }
});
