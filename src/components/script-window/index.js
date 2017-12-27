// @flow
import Script from '../script-card'
import styles from './style.css'
import FileDropper from '@/ui/file-dropper'
import Icon from '@/ui/icon'
import fileDialog from 'file-dialog'
import { trimFilenameExtension } from '../../common/util'
import AssetManager from '../../common/asset-manager'

export default {
    name: 'script-window',
    props: {
        initScripts: Array
    },
    data() {
        return {
            isDragOver: false,
            scripts: []
        }
    },
    watch: {
        initScripts: {
            handler(val) { this.scripts = val },
            immediate: true
        }
    },
    methods: {
        addScript(file) {
            AssetManager.readFile(file).then((content: string) =>
                this.scripts.push({
                    name: trimFilenameExtension(file.name),
                    Behavior: new Function(content)
                }))
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
            {scripts && scripts.map(script => <Script script={script}/>)}
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
