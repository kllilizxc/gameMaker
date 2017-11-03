import styles from './style.css'
import Icon from '@/ui/icon'

export default {
    name: 'tree-view',
    props: {
        data: Array,
        getNameFunction: Function,
        getChildrenFunction: Function
    },
    data () {
        return {
            treeData: this.getItemDataFromPropData(this.data, 0),
            chosenObj: null
        }
    },
    methods: {
        getItemDataFromPropData (data) {
            return data.map(obj => ({
                name: this.getNameFunction(obj),
                children: this.getItemDataFromPropData(this.getChildrenFunction(obj) || []),
                isFolded: true
            }))
        },
        toggleItem (obj) {
            obj.isFolded = !obj.isFolded
            this.chosenObj = obj
            this.$emit('input', obj)
        },
        renderItem (obj) {
            const INDENT_LENGTH = 16
            return <div key={this.getNameFunction(obj)}>
                <div class={styles.treeItem}
                     onClick={e => this.toggleItem(obj)}>
                    <span class={{[styles.chosen]: this.chosenObj === obj}}>{this.getNameFunction(obj)}</span>
                    {obj.children.length > 0 &&
                    <Icon className={{ [styles.arrowIcon]: true, [styles.unFold]: !obj.isFolded }}
                          icon={'arrow_drop_down'}
                          size={24}/>}
                </div>
                {obj.children.length > 0 && !obj.isFolded &&
                <div class={styles.children} style={{ marginLeft: `${INDENT_LENGTH}px` }}>
                    {this.renderItemList(obj.children)}
                </div>}
            </div>
        },
        renderItemList (array) {
            return array.map(obj => this.renderItem(obj))
        }
    },
    render () {
        const {
            treeData,
            renderItemList
        } = this

        return <div class={styles.treeView}>
            {renderItemList(treeData)}
        </div>
    }
}
