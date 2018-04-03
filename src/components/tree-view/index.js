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
            return data.map(obj => {
                const d = {
                    children: [],
                    haveChildren: false,
                    raw: obj
                }

                this.haveChildrenFunction(obj)
                    .then(value => d.haveChildren = value)
                    .then(() => this.toggleItem(d, this.initFold))

                return d
            })
        },
        toggleItem(obj, fold) {
            this.chosenObj = obj
            if (!fold && obj.haveChildren) { // if have children
                this.getChildrenFunction(obj.raw).then(data =>
                    obj.children = this.getItemDataFromPropData(data))
            }
        },
        renderItem(obj) {
            const INDENT_LENGTH = 16
            return <div key={this.getIdFunction(obj.raw)}>
                <DropDown initFold={this.initFold} class={styles.treeItem} canFold={obj.haveChildren} onInput={fold => this.toggleItem(obj, fold)}>
                    <div slot='title'>{this.renderItemFunction(obj.raw, obj.haveChildren)}</div>
                    <div class={styles.children} slot='content' style={{ marginLeft: `${INDENT_LENGTH}px` }}>
                        {this.renderItemList(obj.children)}
                    </div>
                </DropDown>
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
