// @flow
import Script from '../script-card'
import styles from './style.css'
import FileDropper from '@/ui/file-dropper'
import Icon from '@/ui/icon'
import { mapGetters } from 'vuex'
import AssetManager from '@/common/asset-manager'

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
            handler(val) {
                if (!val) {
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
            this.$store.dispatch('addScript', file)
                .then(this.forceRefresh)
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
        pickFile() {
            AssetManager.pickFile('.js', { multiple: true })
                .then(fileList => {
                    for (const file of fileList)
                        this.addScript(file)
                })
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
            isDragOver,
            pickFile,
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
                <div class={{ [styles.dropZone]: true, [styles.dragOver]: isDragOver }} onClick={pickFile}>
                    <Icon className={styles.addIcon} icon={'add'} size={48}/>
                </div>
            </FileDropper>
        </div>
    }
}
