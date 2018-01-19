// @flow
import styles from './style.css'
import Card from '../../ui/card'
import Draggable from '@/ui/draggable'
import { doTransition } from '../../common/util'
import { MAX_SIZE } from '../desktop-manager'

export default {
    name: 'window',
    props: {
        window: {
            type: Object,
            required: true
        }
    },
    data: () => ({
        lastWidth: 0,
        width: 0,
        isMoving: false
    }),
    methods: {
        handleTouchStart(): void {
            this.$emit('startDraggingWindow', this.window.title)
            this.isMoving = true
        },
        handleTouchMove(deltaX: number): void {
            this.$emit('draggingWindow', deltaX)
        },
        handleTouchEnd(deltaX: number): void {
            this.isMoving = false
            this.$emit('draggingWindowEnd', deltaX)
        },
        immediateReleaseWindow() {
            this.handleTouchEnd(0)
        },
        getLastWidth(): number {
            return this.windowRef.offsetWidth
        },
        getCurrentWidth(): number {
            return this.width
        },
        startMoving(): void {
            this.lastWidth = this.getLastWidth()
        },
        move(deltaX: number): void {
            this.width = this.lastWidth + deltaX
        },
        fold(): Promise<any> {
            return this.translateWindow(0)
        },
        expand(actualSize: number): Promise<any> {
            return this.translateWindow(actualSize)
        },
        translateWindow(size: number): Promise<any> {
            this.windowRef.style.transition = 'width 0.3s ease'
            this.windowRef.style.width = `${size / MAX_SIZE * 100}%`
            return doTransition(this.windowRef).then(() => {
                this.windowRef.style.transition = ''
            })
        }
    },
    created() {
        console.log(this.window.size)
        if (this.window.size !== 0)
            this.width = `${this.window.size / MAX_SIZE * 100}%`
    },
    computed: {
        windowRef() {
            console.log(this)
            return this.$el
        }
    },
    watch: {
        ['window.size'](val: number) {
            this.translateWindow(val)
        }
    },
    render() {
        const {
            window: { title, color, content },
            width, isMoving,
            handleTouchStart,
            handleTouchMove,
            handleTouchEnd,
            immediateReleaseWindow
        } = this

        return <div class={styles.window} style={{ width, position: isMoving ? 'absolute' : '' }}>
            <Card class={styles.container}
                  style={{ backgroundColor: color }}>
                {title && <Draggable class={styles.draggable}
                                     touchStart={handleTouchStart}
                                     touchMove={handleTouchMove}
                                     touchEnd={handleTouchEnd}
                                     clickFunction={immediateReleaseWindow}
                                     dragMin={-window.innerWidth}
                                     dragLimit={window.innerWidth}>
                    <div class={styles.title}>{title}</div>
                </Draggable>}
                {content}
            </Card>
        </div>
    }
}
