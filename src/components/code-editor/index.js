import styles from './style.css'
import ace from 'brace'
import 'brace/mode/javascript'
import 'brace/keybinding/vim'
import { mapGetters } from 'vuex'
import { debounce } from '../../common/util'

export default {
    name: 'code-editor',
    data: () => ({
        editor: null,
        initValue: ''
    }),
    watch: {
        currentFile: {
            handler: 'updateContent',
            immediate: true
        },
        currentFileUpdated() {
            this.updateContent()
        }
    },
    methods: {
        updateContent() {
            const { currentFile, game } = this
            const { filesMap } = game
            const setValue = val => this.editor ? this.editor.setValue(val, this.editor.getCursorPosition()) : this.initValue = val
            if (!currentFile || !filesMap[currentFile]) setValue('')
            else setValue(filesMap[currentFile])
        }
    },
    computed: {
        ...mapGetters(['currentFile', 'game', 'currentFileUpdated'])
    },
    mounted() {
        this.editor = ace.edit('editorCotainer')
        this.editor.getSession().setMode('ace/mode/javascript')
        this.editor.setKeyboardHandler('ace/keyboard/vim')
        this.editor.session.on('change', () => {
            if (this.editor.curOp && this.editor.curOp.command.name)
                this.$store.dispatch('editFile', { file: this.currentFile, value: this.editor.getValue() })
        }, 1000)
        this.editor.setValue(this.initValue, 1)
    },
    render() {
        this.editor && this.editor.resize()
        return <div class={styles.codeEditor} style={{ fontSize: '14px' }} id='editorCotainer' ref='container'/>
    }
}
