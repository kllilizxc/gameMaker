import styles from './style.css'
import TreeView from '@/components/tree-view'
import AssetManager from '@/common/asset-manager'
import { logger } from '../../common/util'
import Icon from '@/ui/icon'

function joinPath(path, filename) {
    return path + '/' + filename
}

export default {
    name: 'explorer',
    props: {
        path: String
    },
    data: () => ({
        data: [],
        chosenObj: null
    }),
    methods: {
        getFolderFiles({ name, path }) {
            const parent = joinPath(path, name)
            return AssetManager.readLocalDir(parent)
                .then(files => files.map(filename => ({ name: filename, path: parent })))
                .catch(err => logger.error(err))
        },
        haveChildren({ name, path }) {
            return AssetManager.readLocalStat(joinPath(path, name))
                .then(stats => stats.isDirectory())
                .catch(err => logger.error(err))
        },
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
        }
    },
    watch: {
        path: {
            handler(val) {
                if (!val) return
                AssetManager.readLocalDir(val)
                    .then(files => {
                        this.data = files.map(filename => ({
                            name: filename,
                            path: val
                        }))
                    }).catch(err => console.log(err))
            },
            immediate: true
        }
    },
    render() {
        const {
            data,
            path,
            getFolderFiles,
            haveChildren,
            renderItem
        } = this

        return <div class={styles.explorer}>
            {path
                ? <TreeView data={data}
                            renderItemFunction={renderItem}
                            getIdFunction={d => d.name}
                            getChildrenFunction={getFolderFiles}
                            haveChildrenFunction={haveChildren}/>
                : <p class={styles.hint}>You should save first to use the explorer</p>}
        </div>
    }
}
