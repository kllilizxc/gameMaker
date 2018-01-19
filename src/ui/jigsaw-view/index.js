import styles from './style.css'
import dragula from 'dragula'
import { handleClass } from '../../components/set'

export default {
    name: 'jigsaw-view',
    props: {
        columns: {
            type: Array,
            default: () => []
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
        columnDrake: null
    }),
    methods: {},
    watch: {
        columns: {
            handler(val) {
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
                handle.classList.contains(handleClass)
        })
    },
    render(h) {
        const {
            columns,
            renderColumn,
            renderItem
        } = this

        return <div class={styles.jigsawView} ref="container">
            {columns.map(column =>
                renderColumn(h, column, {
                    class: styles.column,
                    ref: 'columns',
                    refInFor: true
                }, column.map(item =>
                    renderItem(h, item, { class: styles.item }))))}
        </div>
    }
}
