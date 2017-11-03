// @flow
import { mapGetters } from 'vuex'
import Script from '../script-card'
import styles from './style.css'
import FileDropper from '@/ui/file-dropper'
import Icon from '@/ui/icon'
import fileDialog from 'file-dialog'

export default {
    name: 'script-window',
    data() {
        return {
            isDragOver: false
        }
    },
    computed: {
        ...mapGetters('asset', ['scripts'])
    },
    methods: {
        addScript(file) {
            this.$store.dispatch('asset/readScriptFromFile', { gameObjectID: 0, file })
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
            fileDialog({ multiple: true, accept: '.js' })
                .then(fileList => {
                    for (const file of fileList)
                        this.addScript(file)
                })
        }
    },
    render() {
        const {
            scripts,
            dropHandler,
            dragOverHandler,
            dragLeaveHandler,
            isDragOver,
            pickFile
        } = this

        return <div class={styles.scriptWindow}>
            {Object.keys(scripts).map(key => <Script script={scripts[key]}/>)}
            <FileDropper onFileDrop={dropHandler}
                         onFileDragOver={dragOverHandler}
                         onFileDragLeave={dragLeaveHandler}>
                <div class={{[styles.dropZone]: true, [styles.dragOver]: isDragOver}} onClick={pickFile}>
                    <Icon className={styles.addIcon} icon={'add'} size={48}/>
                </div>
            </FileDropper>
        </div>
    }
}
