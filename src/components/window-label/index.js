// @flow
import styles from './style.css'
import Card from 'Ui/card'
import Icon from 'Ui/icon'

import Hideable from '@/ui/hideable'
import { afterTransition } from '../../common/util'
import { MAX_SIZE } from '../desktop-manager/index'

export default {
    name: 'window-label',
    props: {
        icon: {
            required: true
        },
        name: {
            type: String,
            required: true
        }
    },
    data: () => ({
        isHide: true,
        isDragging: false,
        lastX: 0,
        deltaX: 0
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
        setTransition(haveTransition: boolean): void {
            this.$el.style.transition = haveTransition ? 'transform 0.3s ease' : 'none'
        },
        handleTouchStart(e): void {
            this.lastX = e.clientX || e.touches[0].clientX
            this.isDragging = true
            this.$emit('newWindow', { name, content: null })
        },
        handleTouchMove(e): void {
            e.stopPropagation()
            e.preventDefault()

            if (!this.isDragging) return
            const clientX = e.clientX || e.touches[0].clientX
            this.deltaX += clientX - this.lastX
            this.lastX = clientX

            if (this.isDragging && this.deltaX < 0 && this.deltaX > -window.innerWidth) {
                window.requestAnimationFrame(() => this.setTransform(this.deltaX))
                this.$emit('movingWindow', this.deltaX)
            }

        },
        handleTouchEnd(e): void {
            if (this.isDragging) {
                let absDeltaX = Math.abs(this.deltaX)
                let blockWidth = window.innerWidth / MAX_SIZE
                console.log(absDeltaX, blockWidth, Math.ceil((absDeltaX - blockWidth / 2) / blockWidth))
                if (absDeltaX <= blockWidth / 2) {
                    //cancel
                    this.setTransition(true)
                    afterTransition(this.$el, () => {
                        this.setTransition(false)
                        this.isDragging = false
                    })
                    window.requestAnimationFrame(() => this.setTransform(0))
                this.$emit('movingWindowEnd', 0)
                } else {
                    //add new window
                    this.$emit('movingWindowEnd', Math.max(Math.ceil((absDeltaX - blockWidth / 2) / blockWidth), MAX_SIZE))
                    this.isDragging = false
                }
            }
        }
    },
    render() {
        const {
            icon,
            name,
            hide,
            show,
            handleTouchStart,
            handleTouchMove,
            handleTouchEnd,
            isDragging
        } = this

        return <div class={styles.windowLabel}
                    onTouchstart={handleTouchStart}
                    onTouchmove={handleTouchMove}
                    onTouchend={handleTouchEnd}
                    onMousedown={handleTouchStart}
                    onMousemove={handleTouchMove}
                    onMouseleave={handleTouchEnd}
                    onMouseup={handleTouchEnd}>
            <Hideable class={styles.container}
                      hideFunction={hide}
                      showFunction={show}
                      isLocked={isDragging}>
                <Card class={styles.card}>
                    <Icon className={styles.icon} icon={icon} size={32}/>
                    <div class={styles.name}>{name}</div>
                </Card>
            </Hideable>
        </div>
    }
}
