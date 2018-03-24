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
            isDragOver: false
        }
    },
    computed: mapGetters(['gameObject', 'scriptsMap']),
    methods: {
        addScript(file) {
            this.$store.dispatch('addScript', file)
                .then(() => this.$forceUpdate())
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
        },
        getScriptValues(script) {
            return this.scriptsMap[this.gameObject.id].find(({ name }) => name === script.name).values
        }
    },
    render() {
        const {
            gameObject,
            dropHandler,
            dragOverHandler,
            dragLeaveHandler,
            isDragOver,
            pickFile,
            getScriptValues
        } = this

        return <div class={styles.scriptWindow}>
            {gameObject && gameObject.scripts && gameObject.scripts.map(script => <Script script={script} values={getScriptValues(script)}/>)}
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
