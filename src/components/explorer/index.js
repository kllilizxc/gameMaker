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
        haveChildren({ name, path }) {
            return false
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
            },
            immediate: true
        }
    },
    render() {
        const {
            data,
            path,
            haveChildren,
            renderItem
        } = this

        return <div class={styles.explorer}>
            {path
                ? <TreeView data={data}
                            renderItemFunction={renderItem}
                            getIdFunction={d => d.name}
                            getChildrenFunction={() => false}
                            haveChildrenFunction={haveChildren}/>
                : <p class={styles.hint}>You should save first to use the explorer</p>}
        </div>
    }
}
