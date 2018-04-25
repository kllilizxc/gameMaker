import styles from './style.css'
import IconMenu from 'Ui/icon-menu'
import TextField from 'Ui/text-field'

export default {
    name: 'menu-picker',
    props: {
        icon: {
            type: String,
            default: 'add'
        },
        items: {
            type: Array,
            required: true
        },
        iconClass: String,
        renderFunction: {
            type: Function,
            default: item => item
        }
    },
    data: () => ({
        keyword: ''
    }),
    computed: {
        filteredItems() {
            return this.items.filter(item => item.key.includes(this.keyword))
        }
    },
    render() {
        const { icon, iconClass, filteredItems, renderFunction } = this
        return <IconMenu iconClass={iconClass} desktop icon={icon} onItemClick={item => this.$emit('input', item.title)}>
            <TextField fullWidth class={styles.textField} onInput={val => this.keyword = val}/>
            {filteredItems.map(renderFunction)}
        </IconMenu>
    }
}
