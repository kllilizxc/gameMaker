import styles from './style.css'
import ace from 'brace'
import 'brace/mode/javascript'
import 'brace/keybinding/vim'

export default {
    name: 'code-editor',
    data: () => ({
        editor: null
    }),
    mounted() {
        this.editor = ace.edit('editorCotainer')
        this.editor.getSession().setMode('ace/mode/javascript')
        this.editor.setKeyboardHandler('ace/keyboard/vim')
    },
    render() {
        this.editor && this.editor.resize()
        return <div class={styles.codeEditor} style={{ fontSize: '14px' }} id='editorCotainer' ref='container'/>
    }
}
