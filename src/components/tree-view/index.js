import styles from './style.css'
import DropDown from '@/ui/drop-down'

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
            default: () => true
        },
        renderItemFunction: {
            type: Function,
            required: true
        },
        getChildrenFunction: {
            type: Function,
            default: () => []
        },
        initFold: {
            type: Boolean,
            default: true
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
            return data && data.map(obj => {
                const d = {
                    children: [],
                    haveChildren: this.haveChildrenFunction(obj) || false,
                    raw: obj
                }

                this.toggleItem(d, this.initFold)
                return d
            })
        },
        toggleItem(obj, fold) {
            this.chosenObj = obj
            if (!fold && obj.haveChildren)
                obj.children = this.getItemDataFromPropData(this.getChildrenFunction(obj.raw))
        },
        renderItem(obj, parent) {
            const INDENT_LENGTH = 16
            return <div key={this.getIdFunction(obj.raw)}>
                <DropDown initFold={this.initFold} class={styles.treeItem} canFold={obj.haveChildren}
                          onInput={fold => this.toggleItem(obj, fold)}>
                    <div slot='title'>{this.renderItemFunction(obj.raw, parent && parent.raw)}</div>
                    <div class={styles.children} slot='content' style={{ marginLeft: `${INDENT_LENGTH}px` }}>
                        {this.renderItemList(obj.children, obj)}
                    </div>
                </DropDown>
            </div>
        },
        renderItemList(array, parent) {
            return array.map(obj => this.renderItem(obj, parent))
        }
    },
    render() {
        const {
            treeData,
            renderItemList
        } = this

        return <div class={styles.treeView}>
            {treeData.length > 0
                ? renderItemList(treeData)
                : <div>Nothing Found</div>}
        </div>
    }
}
