import styles from './style.css'
import List from '@/ui/list'
import ListItem from '@/ui/list-item'

export default {
    name: 'tree-view',
    props: {
        data: {
            type: Array,
            default: []
        },
        getNameFunction: {
            type: Function,
            default: v => v
        },
        haveChildrenFunction: {
            type: Function,
            default: () => Promise.resolve(true)
        },
        getChildrenFunction: {
            type: Function,
            default: () => Promise.resolve([])
        }
    },
    methods: {
        renderItem(obj, isNested = false) {
            const data = { props: {} }
            if (isNested) data.slot = 'nested'
            this.getChildrenFunction(obj).then(children => obj.children = children)
            this.haveChildrenFunction(obj).then(val => { if (val) data.props.toggleNested = true })
            return <ListItem class={styles.treeItem}
                             title={this.getNameFunction(obj)}
                             {...data}>
                {this.renderItemList(obj.children, true)}
            </ListItem>
        },
        renderItemList(array, isNested = false) {
            return array && array.map(obj => this.renderItem(obj, isNested))
        }
    },
    render() {
        const {
            data,
            renderItemList
        } = this

        return <List>{renderItemList(data)}</List>
    }
}
