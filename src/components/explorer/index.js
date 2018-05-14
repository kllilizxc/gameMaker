import styles from './style.css'
import TreeView from '@/components/tree-view'
import AssetManager from '@/common/asset-manager'
import Icon from '@/ui/icon'
import FileDropper from '@/ui/file-dropper'
import { mapGetters } from 'vuex'

export default {
    name: 'explorer',
    data: () => ({
        isDragOver: false,
        chosenObj: null
    }),
    methods: {
        setChosenItem(obj) {
            this.chosenObj = obj
            this.$store.dispatch('setCurrentScript', obj.name || obj)
        },
        handleDragStart(e, obj) {
            if (obj.assets !== undefined) {
                e.preventDefault()
                e.stopPropagation()
                return false
            }
            e.dataTransfer.setData('file', JSON.stringify({ name: obj, data: this.filesMap[obj] }))
        },
        renderItem(obj) {
            const isChosen = obj === this.chosenObj
            return <div class={[styles.item, {[styles.chosen]: isChosen}]}>
                <Icon className={styles.icon} icon={obj.assets ? 'folder' : 'insert_drive_file'} size={24}/>
                <span class={styles.name}
                      onClick={() => this.setChosenItem(obj)}
                      draggable onDragstart={e => this.handleDragStart(e, obj)}>{obj.name || obj}</span>
            </div>
        },
        dropHandler(file) {
            this.$store.dispatch('uploadAssets', file)
            this.isDragOver = false
        },
        dragOverHandler() {
            this.isDragOver = true
        },
        dragLeaveHandler() {
            this.isDragOver = false
        },
        pickFile() {
            AssetManager.pickFile('', { multiple: true })
                .then(fileList => this.$store.dispatch('uploadAssets', fileList))
        }
    },
    computed: {
        ...mapGetters(['assets', 'filesMap']),
        assetsTree() {
            return Object.keys(this.assets).map(name => ({ name, assets: this.assets[name] }))
        }
    },
    render() {
        const {
            assetsTree,
            dropHandler,
            dragOverHandler,
            dragLeaveHandler,
            isDragOver,
            pickFile,
            renderItem
        } = this

        return <div class={styles.explorer}>
            <TreeView data={assetsTree}
                      renderItemFunction={renderItem}
                      initFold={false}
                      getIdFunction={d => d.name || d}
                      getChildrenFunction={d => d.assets}
                      haveChildrenFunction={d => d.assets && d.assets.length > 0}/>
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
