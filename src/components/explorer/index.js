import styles from './style.css'
import TreeView from '@/components/tree-view'
import AssetManager from '@/common/asset-manager'
import { logger } from '../../common/util'

function joinPath(path, filename) {
    return path + '/' + filename
}

export default {
    name: 'explorer',
    props: {
        path: String
    },
    data: () => ({
        data: []
    }),
    methods: {
        getFolderFiles({ name, path }) {
            let parent = joinPath(path, name)
            return AssetManager.readLocalDir(parent)
                .then(files => files.map(filename => ({ name: filename, path: parent })))
                .catch(err => logger.error(err))
        },
        haveChildren({ name, path }) {
            return AssetManager.readLocalStat(joinPath(path, name))
                .then(stats => stats.isDirectory())
                .catch(err => logger.error(err))
        },
        handleInput (obj) {
            console.log(obj.name)
        }
    },
    created() {
        AssetManager.readLocalDir(this.path)
            .then(files => {
                this.data = files.map(filename => ({
                    name: filename,
                    path: this.path
                }))
            }).catch(err => console.log(err))
    },
    render() {
        let {
            data,
            getFolderFiles,
            haveChildren,
            handleInput
        } = this

        return <div class={styles.explorer}>
            <TreeView data={data}
                      getNameFunction={d => d.name}
                      getChildrenFunction={getFolderFiles}
                      haveChildrenFunction={haveChildren}
                      onInput={handleInput}/>
        </div>
    }
}
