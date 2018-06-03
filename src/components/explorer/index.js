import styles from './style.css'
import TreeView from '@/components/tree-view'
import AssetManager from '@/common/asset-manager'
import Icon from '@/ui/icon'
import FileDropper from '@/ui/file-dropper'
import { mapGetters } from 'vuex'
import TextField from '@/ui/text-field'
import IconButton from '@/ui/material-icon-button'
import UndoableAction from '../../classes/undoableAction'

export const templates = {
    animation: `{
}`,
    script: `fields = {}

function init() {}

function update() {}`
}

export default {
    name: 'explorer',
    data: () => ({
        isDragOver: false,
        editingObj: null,
        updateAssets: false,
        editValue: null
    }),
    methods: {
        setChosenItem(obj) {
            if (obj.name) return
            this.$store.dispatch('setCurrentFile', obj)
        },
        forceUpdateAssets() {
            this.updateAssets = !this.updateAssets
        },
        toggleEditMode(obj) {
            if (obj.children) return // not allow to edit category names
            if (this.editingObj === obj) {
                this.editFileName(this.editValue || obj.name || obj)
                this.editValue = null
                this.editingObj = null
                this.forceUpdateAssets()
            } else
                this.editingObj = obj
        },
        handleDragStart(e, obj) {
            if (obj.assets !== undefined) {
                e.preventDefault()
                e.stopPropagation()
                return false
            }
            e.dataTransfer.setData('file', JSON.stringify({ name: obj, data: this.game.filesMap[obj] }))
        },
        editFileName(value) {
            const { editingObj } = this
            const oldName = editingObj.name || editingObj
            UndoableAction.addAction(new UndoableAction(
                { oldName: value, name: oldName },
                { oldName, name: value },
                val => this.$store.dispatch('editAssetName', val)
                    .then(this.forceUpdateAssets)))
        },
        handleKeydown(e, obj) {
            if (e.code === 'Enter')
                this.toggleEditMode(obj)
        },
        handleDelete(obj) {
            let category
            const data = this.game.filesMap[obj]
            this.assetsTree.forEach(({ assets, name }) => {
                if (assets.find(fileName => fileName === obj))
                    category = name
            })
            UndoableAction.addAction(new UndoableAction(
                { name: obj, category, data },
                obj,
                val => this.$store.dispatch(val.name ? 'createAsset' : 'removeAsset', val)
                    .then(this.forceUpdateAssets)
            ))
        },
        renderItem(obj) {
            const isChosen = obj === this.currentFile
            const value = obj.name || obj
            return <div class={[styles.item, { [styles.chosen]: isChosen }]}>
                <Icon className={styles.icon} icon={obj.assets ? 'folder' : 'insert_drive_file'} size={24}/>
                <span class={styles.name}
                      onClick={() => this.setChosenItem(obj)}
                      onDblclick={() => this.toggleEditMode(obj)}
                      onKeydown={e => this.handleKeydown(e, obj)}
                      draggable onDragstart={e => this.handleDragStart(e, obj)}>{
                    this.editingObj === obj
                        ? <TextField value={value} onInput={val => this.editValue = val}/>
                        : value
                }</span>
                {obj.assets && (obj.name === 'scripts' || obj.name === 'animations') &&
                <IconButton icon={'add'} size={24} onClick={() => this.createAsset(obj.name)}/>}
                {isChosen && <IconButton icon={'cancel'} size={24} onClick={() => this.handleDelete(obj)}/>}
            </div>
        },
        createAsset(name) {
            const instanceName = name.slice(0, name.length - 1)
            const assetName = 'new' + instanceName.charAt(0).toUpperCase() + instanceName.slice(1)
            UndoableAction.addAction(new UndoableAction(assetName, { name: assetName, data: templates[instanceName], category: name },
                val => this.$store.dispatch(val.name ? 'createAsset' : 'removeAsset', val)))
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
        ...mapGetters(['assets', 'game', 'currentFile']),
        assetsTree() {
            const { updateAssets } = this
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
