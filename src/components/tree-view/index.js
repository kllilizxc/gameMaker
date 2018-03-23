import styles from './style.css'
import IconButton from '@/ui/material-icon-button'

export default {
    name: 'tree-view',
    props: {
        data: {
            type: Array,
            default: []
        },
        getIdFunction: Function,
        haveChildrenFunction: {
            type: Function,
            default: () => Promise.resolve(true)
        },
        renderItemFunction: {
            type: Function,
            required: true
        },
        getChildrenFunction: {
            type: Function,
            default: () => Promise.resolve([])
        },
        selected: Object
    },
    data: () => ({
        treeData: [],
        chosenObj: null
    }),
    watch: {
        data: {
            handler(value) {
                this.treeData = this.getItemDataFromPropData(value)
            },
            immediate: true
        },
        selected: {
            handler(value) {
                this.chosenObj = this.treeData.find(d => d.raw === value)
            },
            immediate: true
        }
    },
    methods: {
        setTreeData() {
            this.treeData = this.getItemDataFromPropData(this.data)
        },
        getItemDataFromPropData(data) {
            return data.map(obj => {
                const d = {
                    children: [],
                    isFolded: true,
                    haveChildren: false,
                    raw: obj
                }

                this.haveChildrenFunction(obj).then(value => d.haveChildren = value)

                return d
            })
        },
        toggleItem(obj) {
            this.chosenObj = obj
            if (obj.haveChildren) { // if have children
                obj.isFolded = !obj.isFolded
                this.getChildrenFunction(obj.raw).then(data => obj.children = this.getItemDataFromPropData(data))
            }
        },
        renderItem(obj) {
            const INDENT_LENGTH = 16
            return <div key={this.getIdFunction(obj.raw)}>
                <div class={styles.treeItem}>
                    {this.renderItemFunction(obj.raw, obj.haveChildren)}
                    {obj.haveChildren &&
                    <IconButton class={[styles.arrowIcon, { [styles.unFold]: !obj.isFolded }]}
                          icon={'arrow_drop_down'} onClick={() => this.toggleItem(obj)} size={32}/>}
                </div>
                {obj.children.length > 0 && !obj.isFolded &&
                <div class={styles.children} style={{ marginLeft: `${INDENT_LENGTH}px` }}>
                    {this.renderItemList(obj.children)}
                </div>}
            </div>
        },
        renderItemList(array) {
            return array.map(obj => this.renderItem(obj))
        }
    },
    render() {
        const {
            treeData,
            renderItemList
        } = this

        return <div class={styles.treeView}>
            {renderItemList(treeData)}
        </div>
    }
}
