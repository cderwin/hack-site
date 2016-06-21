import Vue from 'vue';
import html from './assembler.jade';
import { Assembler } from '../utils/assembler.js';
import { footerStore } from './footer.js';
import { router } from '../initialize.js';

export default Vue.component('assembler',
{
    name: 'assembler',
    template: html(),

    data() {
        return {
            editorContent: '',
            assembler: new Assembler(),
            editorClasses: ['code'],
            showInstructions: false
        };
    },

    methods: {
        assemble() {
            this.assembler.clearState();
            this.assembler.assemble(this.editorContent);
            this.editorClasses = ['code-thin'];
            this.showInstructions = true;
            footerStore.addAction('reset',
            {
                name: 'Reset',
                callback: () => {
                    this.editorClasses = ['code'];
                    this.showInstructions = false;
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
