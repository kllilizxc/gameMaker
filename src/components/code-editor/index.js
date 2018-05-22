import styles from './style.css'
import ace from 'brace'
import 'brace/mode/javascript'
import 'brace/keybinding/vim'
import { mapGetters } from 'vuex'
import { debounce } from '../../common/util'

export default {
    name: 'code-editor',
    data: () => ({
        editor: null
    }),
    watch: {
        currentScript(val) {
            const { filesMap } = this.game
            if (!val || !filesMap[val]) this.editor.setValue('')
            else this.editor.setValue(filesMap[val])
        }
    },
    computed: {
        ...mapGetters(['currentScript', 'game'])
    },
    mounted() {
        this.editor = ace.edit('editorCotainer')
        this.editor.getSession().setMode('ace/mode/javascript')
        this.editor.setKeyboardHandler('ace/keyboard/vim')
        this.editor.session.on('change', debounce(() => {
            this.$store.dispatch('editFile', { file: this.currentScript, value: this.editor.getValue() })
        }, 1000))
    },
    render() {
        this.editor && this.editor.resize()
        return <div class={styles.codeEditor} style={{ fontSize: '14px' }} id='editorCotainer' ref='container'/>
    }
}
