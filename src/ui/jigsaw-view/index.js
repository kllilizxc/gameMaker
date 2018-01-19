// @flow
// @jsx h

import styles from './style.css'
import dragula from 'dragula'
import { handlerClass } from '../../components/set'

type ColumnType = any[]

export default {
    name: 'jigsaw-view',
    props: {
        columns: {
            type: Array,
            default: () => []
        },
        getItemsInColumn: {
            type: Function,
            default: col => col
        },
        renderColumn: {
            type: Function,
            default: (h, col, data, childern) => col
        },
        renderItem: {
            type: Function,
            default: (h, item, data) => item
        }
    },
    data: () => ({
        innerColumns: [],
        columnDrake: null
    }),
    methods: {
        getInnerColumns(columns: any[]): ColumnType[] {
            return columns
                ? columns.map(col => this.getItemsInColumn(col))
                : []
        }
    },
    watch: {
        columns: {
            handler(val: any[]): void {
                this.innerColumns = this.getInnerColumns(val)
                this.$nextTick(() => {
                    this.columnDrake =
                        dragula(this.$refs.columns
                                .map(col => col.$el ? col.$el : col),
                            { revertOnSpill: true })
                    console.log(this.columnDrake.containers)
                })
            },
            immediate: true
        }
    },
    mounted() {
        const { container } = this.$refs
        dragula([container], {
            direction: 'horizontal',
            revertOnSpill: true,
            moves: (el, source, handle) => !el.dataset.fixed &&
                handle.classList.contains(handlerClass)
        })
    },
    render(h: any): any {
        const {
            innerColumns,
            renderColumn,
            renderItem
        } = this

        return <div class={styles.jigsawView} ref="container">
            {innerColumns.map(column =>
                renderColumn(h, column, {
                    class: styles.column,
                    ref: 'columns',
                    refInFor: true
                }, column.map(item =>
                    renderItem(h, item, { class: styles.item }))))}
        </div>
    }
}
