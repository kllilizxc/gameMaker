// @flow
import styles from './style.css'
import Card from 'Ui/card'
import Icon from 'Ui/icon'

import Hideable from '@/ui/hideable'
import Draggable from '@/ui/draggable'
import { afterTransition } from '../../common/util'
import { MAX_SIZE } from '../desktop-manager/index'

export default {
    name: 'window-label',
    props: {
        icon: {
            required: true
        },
        title: {
            type: String,
            required: true
        },
        color: {
            type: String,
            default: '#fff'
        }
    },
    data: () => ({
        isHide: true,
        shouldClear: false
    }),
    methods: {
        hide(style: { transform: string, marginBottom: string }): void {
            style.transform = 'translateX(80%)'
            style.marginBottom = '-20px'
            this.isHide = true
        },
        show(style: { transform: string, margin: string }): void {
            style.transform = 'translateX(0)'
            style.margin = '0'
            this.isHide = false
        },
        setTransform(translateX: number): void {
            this.$el.style.transform = `translateX(${translateX}px)`
        },
        setTransformAnimated(from: number, to: number, callback: (number) => void): void {
            const duration = 300
            let totalTime = 0
            const startTime = new Date().getTime()
            const t = setInterval(() => {
                const nowTime = new Date().getTime()
                totalTime += nowTime - startTime
                const deltaX = to + (from - to) * totalTime / duration
                this.$el.style.transform = `translateX(${deltaX}px)`
                callback(deltaX)
                if (Math.abs(deltaX) >= Math.abs(from))
                    clearInterval(t)
            }, 10)
        },
        setTransition(haveTransition: boolean): void {
            this.$el.style.transition = haveTransition ? 'transform 0.3s ease' : 'none'
        },
        handleTouchStart(): void {
            this.$emit('newWindow', { title: this.title, content: null, color: this.color, icon: this.icon })
        },
        handleTouchMove(deltaX): void {
            window.requestAnimationFrame(() => this.setTransform(deltaX))
            this.$emit('movingWindow', deltaX)
        },
        handleTouchEnd(deltaX): void {
            const absDeltaX = Math.abs(deltaX)
            const blockWidth = window.innerWidth / MAX_SIZE
            if (absDeltaX <= blockWidth / 2) {
                // cancel
                this.setTransition(true)
                afterTransition(this.$el, () => {
                    this.setTransition(false)
                })
                window.requestAnimationFrame(() => this.setTransform(0))
                this.$emit('movingWindowEnd', 0)
            } else {
                // add new window
                this.$emit('movingWindowEnd', Math.min(Math.ceil((absDeltaX - blockWidth / 2) / blockWidth), MAX_SIZE))
                this.shouldClear = true
            }
        }
    },
    render() {
        const {
            icon,
            title,
            color,
            hide,
            show,
            handleTouchStart,
            handleTouchMove,
            handleTouchEnd,
            isDragging,
            shouldClear
        } = this

        return !shouldClear &&
            <Hideable
                class={styles.windowLabel}
                hideFunction={hide}
                showFunction={show}
                isLocked={isDragging}>
                <Draggable
                    class={styles.container}
                    touchStart={handleTouchStart}
                    touchMove={handleTouchMove}
                    touchEnd={handleTouchEnd}
                    dragLimit={8}
                    dragMin={-window.innerWidth}>
                    <Card class={styles.card} style={{ background: color }}>
                        <Icon className={styles.icon} icon={icon} size={32}/>
                        <div class={styles.title}>{title}</div>
                    </Card>
                </Draggable>
            </Hideable>
    }
}
