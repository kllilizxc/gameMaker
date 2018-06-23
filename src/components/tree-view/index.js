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
        getChildrenFunction: {
            type: Function,
            default: () => []
        },
        renderItemFunction: {
            type: Function,
            required: true
        },
        initFold: {
            type: Boolean,
            default: true
        },
        indent: {
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
            this.treeData = this.getItemDataFromPropData(this.data, null)
        },
        getItemDataFromPropData(data, parent) {
            return data && data.map(obj => {
                const d = {
                    parent,
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
            obj.fold = fold
            if (!fold && obj.haveChildren)
                obj.children = this.getItemDataFromPropData(this.getChildrenFunction(obj.raw), obj)
        },
        renderItem(obj, parent) {
            return <div class={styles.itemContainer} key={this.getIdFunction(obj.raw)} ref='item' refInFor>
                <DropDown initFold={this.initFold} class={styles.treeItem} canFold={obj.haveChildren}
                          onInput={fold => this.toggleItem(obj, fold)}>
                    <div class={styles.title} slot='title'>{this.renderItemFunction(obj.raw, parent && parent.raw)}</div>
                    <transition-group name="bounce" tag="div" style={{ marginLeft: this.indent ? '16px' : '' }} slot='content'>
                        {this.renderItemList(obj.children, obj)}
                    </transition-group>
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
            <transition-group name="bounce" tag="div">
            {treeData.length > 0
                ? renderItemList(treeData)
                : <div key={-1} class={styles.hint}>Nothing Found</div>}
            </transition-group>
        </div>
    }
}