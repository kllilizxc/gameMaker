import styles from './style.css'
import TextField from 'Ui/text-field'
import IconButton from 'Ui/material-icon-button'
import { DialogService } from '@/components/dialog'
import TreeView from '@/components/tree-view'
import MenuItem from 'Ui/menu-item'

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
        },
        placeHolder: String
    },
    data: () => ({
        keyword: ''
    }),
    computed: {
        filteredItems() {
            const filtered = this.items.slice(0)
            return filtered.map(item => {
                const newItem = { key: item.key }
                newItem.children = item.children.filter(({ key }) => key.toLowerCase().includes(this.keyword))
                return newItem
            }).filter(item => item.children && item.children.length > 0)
        }
    },
    methods: {
        showMenu() {
            console.log(this.filteredItems)
            DialogService.show({
                contentSlot: (h, close) =>
                    <div>
                        <TextField fullWidth class={styles.textField}
                                   value={this.keyword}
                                   placeHolder={this.placeHolder || 'Type to Search'}
                                   onInput={val => this.keyword = val.toLowerCase()}/>
                        <TreeView data={this.filteredItems}
                                  getIdFunction={item => item.key}
                                  haveChildrenFunction={item => item.children && item.children.length > 0}
                                  getChildrenFunction={item => item.children}
                                  initFold={false}
                                  indent={false}
                                  renderItemFunction={item =>
                                      <MenuItem title={item.key} onClick={() => {
                                          this.$emit('input', item)
                                          close()
                                      }}/>}/>
                    </div>
            })
        }
    },
    render() {
        return <IconButton icon={this.icon} onClick={this.showMenu}/>
    }
}
