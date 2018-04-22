import styles from './style.css'
import TreeView from '@/components/tree-view'
import AssetManager from '@/common/asset-manager'
import Icon from '@/ui/icon'
import FileDropper from '@/ui/file-dropper'
import { mapGetters } from 'vuex'

function joinPath(path, filename) {
    return path + '/' + filename
}

export default {
    name: 'explorer',
    data: () => ({
        isDragOver: false,
        chosenObj: null
    }),
    methods: {
        setChosenItem(obj) {
            this.chosenObj = obj
            console.log(obj.name)
        },
        handleDragStart(e, obj) {
            e.dataTransfer.setData('filename', joinPath(obj.path, obj.name))
        },
        renderItem(obj, haveChildren) {
            const isChosen = obj === this.chosenObj
            return <div class={[styles.item, {[styles.chosen]: isChosen}]}>
                <Icon className={styles.icon} icon={haveChildren ? 'folder' : 'insert_drive_file'} size={24}/>
                <span class={styles.name}
                      onClick={() => this.setChosenItem(obj)}
                      draggable onDragstart={e => this.handleDragStart(e, obj)}>{obj.name}</span>
            </div>
        },
        dropHandler(file) {
            console.log(file)
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
                .then(fileList => {
                    for (const file of fileList)
                        console.log(file)
                })
        }
    },
    computed: {
        ...mapGetters(['assets']),
        assetsTree() {
            return Object.keys(this.assets).map(key => ({ key, assets: this.assets[key] }))
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
                      getIdFunction={d => d.key || d  }
                      getChildrenFunction={d => Promise.resolve(d.assets)}
                      haveChildrenFunction={d => Promise.resolve(d.assets && d.assets.length > 0)}/>
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
