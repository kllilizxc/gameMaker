// @flow
import styles from './style.css'
import Card from '@/ui/card'
import Draggable from '@/ui/draggable'

import { MAX_SIZE } from '../desktop-manager/index'
import { afterTransition } from '../../common/util'

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
            this.$emit('newWindow', { name: this.name })
            console.log('start')
        },
        handleTouchMove(deltaX): void {
            this.$emit('movingWindow', deltaX)
            console.log(deltaX)
        },
        handleTouchEnd(deltaX, stopDragging): void {
            const absDeltaX = Math.abs(deltaX)
            const blockWidth = window.innerWidth / MAX_SIZE
            if (absDeltaX <= blockWidth / 2) {
                // cancel
                this.setTransition(true)
                afterTransition(this.$el, () => {
                    this.setTransition(false)
                    stopDragging()
                })
                window.requestAnimationFrame(() => this.setTransform(0))
                this.$emit('movingWindowEnd', 0)
            } else {
                // add new window
                this.$emit('movingWindowEnd', Math.min(Math.ceil((absDeltaX - blockWidth / 2) / blockWidth), MAX_SIZE))
                stopDragging()
            }
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
                <Draggable class={styles.title}
                           touchStart={handleTouchStart}
                           touchMove={handleTouchMove}
                           touchEnd={handleTouchEnd}
                           dragMin={-window.innerWidth}
                           dragLimit={window.innerWidth}>
                    {title}
                </Draggable>
                {this.$slots.default}
            </Card>
        </div>
    }
}
