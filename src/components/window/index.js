// @flow
import styles from './style.css'
import Card from '@/ui/card'
import Draggable from '@/ui/draggable'

export default {
    name: 'window',
    props: {
        title: String,
        color: {
            type: String,
            default: '#fff'
        }
    },
    methods: {
        handleTouchStart(): void {
            this.$emit('startDraggingWindow', this.title)
        },
        handleTouchMove(deltaX: number): void {
            this.$emit('draggingWindow', deltaX)
        },
        handleTouchEnd(deltaX: number): void {
            this.$emit('draggingWindowEnd', deltaX)
        }
    },
    render() {
        const {
            title,
            color,
            handleTouchStart,
            handleTouchMove,
            handleTouchEnd
        } = this

        return <div class={styles.window}>
            <Card class={styles.container}
                  style={{ backgroundColor: color }}>
                <Draggable class={styles.draggable}
                           touchStart={handleTouchStart}
                           touchMove={handleTouchMove}
                           touchEnd={handleTouchEnd}
                           dragMin={-window.innerWidth}
                           dragLimit={window.innerWidth}>
                    <div class={styles.title}>{title}</div>
                </Draggable>
                {this.$slots.default}
            </Card>
        </div>
    }
}
