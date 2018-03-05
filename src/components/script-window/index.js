// @flow
import Script from '../script-card'
import styles from './style.css'
import FileDropper from '@/ui/file-dropper'
import Icon from '@/ui/icon'
import { readScriptFromFile } from '../../common/util'
import { mapGetters } from 'vuex'
import AssetManager from '@/common/asset-manager'

export default {
    name: 'script-window',
    props: {},
    data() {
        return {
            isDragOver: false,
            refresh: false
        }
    },
    computed: mapGetters(['gameObject']),
    methods: {
        addScript(file) {
            readScriptFromFile(file).then(script => {
                this.gameObject.scripts = this.gameObject.scripts || []
                this.gameObject.scripts.push(script)
                this.forceRefresh()
            })
        },
        forceRefresh() {
            this.refresh = !this.refresh
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
            AssetManager.pickFiles(
                'Now pick your scripts',
                [],
                [{ name: 'Scripts', extensions: ['js'] }])
                .then(fileList => {
                    for (const file of fileList)
                        this.addScript(file)
                })
        }
    },
    render() {
        const {
            gameObject: { scripts },
            dropHandler,
            dragOverHandler,
            dragLeaveHandler,
            isDragOver,
            pickFile,
            refresh
        } = this

        return <div class={styles.scriptWindow}>
            {scripts && scripts.map(script => <Script script={script}/>)}
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
