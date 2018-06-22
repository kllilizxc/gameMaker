// @flow
import styles from './style.css'
import Card from '@/ui/card'
import Draggable from '@/ui/draggable'

export default {
    name: 'window',
    props: {
        window: {
            type: Object,
            required: true
        }
    },
    methods: {
        handleTouchStart(): void {
            this.$emit('startDraggingWindow', this.window.title)
        },
        handleTouchMove(deltaX: number): void {
            this.$emit('draggingWindow', deltaX)
        },
        handleTouchEnd(deltaX: number): void {
            this.$emit('draggingWindowEnd', deltaX)
        },
        immediateReleaseWindow() {
            this.handleTouchEnd(0)
        }
    },
    render() {
        const {
            window: { title, color },
            handleTouchStart,
            handleTouchMove,
            handleTouchEnd,
            immediateReleaseWindow
        } = this

        return <div class={styles.window} ref='root'>
            <Card class={styles.container}
                  roundCorner={false}
                  style={{ backgroundColor: color }}>
                {title && <Draggable class={styles.draggable}
                                     touchStart={handleTouchStart}
                                     touchMove={handleTouchMove}
                                     touchEnd={handleTouchEnd}
                                     clickFunction={immediateReleaseWindow}
                                     dragMin={-window.innerWidth}
                                     dragLimit={window.innerWidth}>
                    <div class={styles.title} data-title={title}>{title}</div>
                </Draggable>}
                {this.$slots.default}
            </Card>
        </div>
    }
}
