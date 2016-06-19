import Vue from 'vue';
import html from './assembler.jade';
import assemble from '../utils/assembler.js';
import { footerStore } from './footer.js';
import { router } from '../initialize.js';

export default Vue.component('assembler',
{
    name: 'assembler',
    template: html(),

    data() {
        return {
            editorContent: '',
            instructions: [],
            editorClasses: ['code'],
            instructionClasses: ['output-hidden'],
        };
    },

    methods: {
        assemble() {
            const assembly = this.editorContent;
            this.instructions = assemble(assembly);
            this.editorClasses = ['code-thin'];
            this.instructionClasses = ['output-show'];
            footerStore.addAction('reset', 
            {
                name: 'Reset',
                callback: () => {
                    this.editorClasses = ['code'];
                    this.instructionClasses = ['output-hidden'];
                    this.instructions = [];
                    footerStore.removeAction('reset');
                }
            });
        }
    },

    ready(){
        footerStore.setActions({
            assemble: {
                name: 'Assemble',
                callback: this.assemble
            },
            run: {
                name: 'Run',
                callback: () => router.go('/vm')
            }
        });
    }
});
