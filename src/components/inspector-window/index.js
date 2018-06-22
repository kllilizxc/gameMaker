// @flow
import ScriptCard from '../script-card'
import styles from './style.css'
import FileDropper from '@/ui/file-dropper'
import { mapGetters, mapActions } from 'vuex'
import MenuPicker from 'Components/menu-picker'
import defaultScripts from '../../../static/scripts'
import { getFileExtension } from '@/common/util'

export default {
    name: 'inspector-window',
    props: {},
    data() {
        return {
            isDragOver: false,
            refreshScripts: false,
            scripts: []
        }
    },
    computed: {
        ...mapGetters(['game', 'gameObject', 'isPlaying'])
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
        ...mapActions(['setIsLoading']),
        getScripts(gameObject) {
            const { scripts } = gameObject
            this.scripts = Object.keys(scripts).map(key => scripts[key])
        },
        addScript(file) {
            if (!this.gameObject) return
            if (file instanceof File) {
                this.setIsLoading(true)
                this.$store.dispatch('uploadAssets', file)
                    .then(fileData => this.game.addScript(this.gameObject, fileData))
                    .finally(() => this.setIsLoading(false))
            } else if (file.data) {
                this.game.addScript(this.gameObject, file)
            }
        },
        forceRefresh() {
            this.refreshScripts = !this.refreshScripts
        },
        dropHandler(file) {
            if (getFileExtension(file.name) === 'temp')
                this.$store.dispatch('setGameObject',
                    this.game.addScriptFromTemplate(file, this.gameObject))
            else
                this.addScript(file)
            this.isDragOver = false
        },
        dragOverHandler() {
            this.isDragOver = true
        },
        dragLeaveHandler() {
            this.isDragOver = false
        },
        dragScript({ e, name }) {
            e.dataTransfer.setData('script', JSON.stringify({
                id: this.gameObject.id, name
            }))
        },
        setScriptValue(data) {
            if (this.isPlaying) return
            if (data.groupName)
                this.game.setGroupScriptValue(this.gameObject, data)
            else
                this.game.setScriptValue(this.gameObject, data)
        },
        deleteScript(name) {
            this.setIsLoading(true)
            this.$store.dispatch('removeScript', name)
                .finally(() => this.setIsLoading(false))
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
            dragScript,
            deleteScript,
            setScriptValue
        } = this

        return <div class={styles.scriptWindow}>
            <transition-group name="bounce" tag="div">
                {scripts.map(script => <ScriptCard mKey={`${this.gameObject.id}:${script.name}`}
                                                   script={script}
                                                   onDelete={deleteScript}
                                                   onDrag={dragScript}
                                                   onInput={setScriptValue}/>)}
            </transition-group>
            <FileDropper onFileDrop={dropHandler}
                         onFileDragOver={dragOverHandler}
                         onFileDragLeave={dragLeaveHandler}>
                <div class={{ [styles.dropZone]: true, [styles.dragOver]: isDragOver }}>
                    <MenuPicker class={styles.menuPicker}
                                style={{ margin: 'auto' }}
                                items={defaultScripts}
                                placeHolder={'Type to search scripts'}
                                onInput={({ key, data }) => addScript({ name: key, data })}/>
                </div>
            </FileDropper>
        </div>
    }
}
