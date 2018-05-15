// @flow
import Script from '../script-card'
import styles from './style.css'
import FileDropper from '@/ui/file-dropper'
import { mapGetters } from 'vuex'
import MenuItem from 'Ui/menu-item'
import MenuPicker from 'Components/menu-picker'
import defaultScripts from '../../../static/scripts'

export default {
    name: 'script-window',
    props: {},
    data() {
        return {
            isDragOver: false,
            refreshScripts: false,
            scripts: []
        }
    },
    computed: {
        ...mapGetters(['gameObject', 'isPlaying'])
    },
    watch: {
        gameObject: {
            handler(val, oldVal) {
                if (!val || val === oldVal) {
                    this.scripts = []
                    return
                }
                this.getScripts(val)
                val.registerScriptsReadyHandler(() => this.getScripts(val))
            },
            immediate: true
        }
    },
    methods: {
        getScripts(gameObject) {
            const { scripts } = gameObject
            this.scripts = Object.keys(scripts).map(key => scripts[key])
        },
        addScript(file) {
            if (file instanceof File) {
                this.$store.dispatch('uploadAssets', file)
                    .then((fileData) => this.$store.dispatch('addScript', fileData))
            } else if (file.data) {
                this.$store.dispatch('addScript', file)
            }
        },
        forceRefresh() {
            this.refreshScripts = !this.refreshScripts
        },
        dropHandler(file) {
            this.addScript(file)
            this.isDragOver = false
        },
        dragOverHandler() {
            this.isDragOver = true
        },
        dragLeaveHandler() {
            this.isDragOver = false
        },
        setScriptValue(data) {
            if (this.isPlaying) return
            if (data.groupName)
                this.$store.dispatch('setGroupScriptValue', data)
            else
                this.$store.dispatch('setScriptValue', data)
        },
        deleteScript(name) {
            this.$store.dispatch('removeScript', name)
        }
    },
    render() {
        const {
            scripts,
            dropHandler,
            dragOverHandler,
            dragLeaveHandler,
            addScript,
            isDragOver,
            deleteScript,
            setScriptValue
        } = this

        return <div class={styles.scriptWindow}>
            {scripts.map(script => <Script key={`${this.gameObject.id}:${script.name}`}
                                           script={script}
                                           onDelete={deleteScript}
                                           onInput={setScriptValue}/>)}
            <FileDropper onFileDrop={dropHandler}
                         onFileDragOver={dragOverHandler}
                         onFileDragLeave={dragLeaveHandler}>
                <div class={{ [styles.dropZone]: true, [styles.dragOver]: isDragOver }}>
                    <MenuPicker class={styles.menuPicker}
                                items={Object.keys(defaultScripts).map(key => ({ key, data: defaultScripts[key] }))}
                                onInput={key => addScript({ name: key, data: defaultScripts[key] })}
                                renderFunction={({ key, data }) =>
                                    <MenuItem title={key}>
                                        {Object.keys(data).map(childKey =>
                                            <MenuItem title={childKey}/>)}
                                    </MenuItem>
                                }/>
                </div>
            </FileDropper>
        </div>
    }
}
