// @flow
import styles from './style.css'

export default {
    name: 'draggable',
    props: {
        touchStart: Function,
        touchMove: Function,
        touchEnd: Function,
        dragLimit: {
            type: Number,
            default: window.innerWidth
        },
        dragMin: {
            type: Number,
            default: 8
        },
        clickFunction: {
            type: Function,
            default: e => null
        }
    },
    data: () => ({
        isDragging: false,
        lastX: 0,
        deltaX: 0,
        touchIsDragging: false,
        startTouching: false
    }),
    methods: {
        handleTouchStart(e: any): void {
            this.lastX = e.clientX || e.touches[0].clientX
            this.deltaX = 0
            this.isDragging = false
            this.touchIsDragging = false
            this.startTouching = true
        },
        handleTouchMove(e: any): void {
            if (!this.startTouching) return
            e.stopPropagation()
            e.preventDefault()

            const clientX = e.clientX || (e.touches && e.touches[0].clientX)
            this.deltaX += clientX - this.lastX
            this.lastX = clientX

            this.isDragging = Math.abs(this.deltaX) > 8
            if (this.isDragging && this.deltaX < this.dragLimit && this.deltaX > this.dragMin) {
                if (!this.touchIsDragging) {
                    this.touchIsDragging = true
                    this.touchStart()
                } else
                    this.touchMove(this.deltaX)
            }
        },
        handleTouchEnd(): void {
            if (!this.startTouching || !this.touchIsDragging || !this.isDragging) return
            this.touchIsDragging = false
            this.isDragging = false
            this.startTouching = false
            this.touchEnd(this.deltaX)
        }
    },
    created() {
        document.addEventListener('mousemove', this.handleTouchMove)
        document.addEventListener('mouseup', this.handleTouchEnd)
        document.addEventListener('mouseleave', this.handleTouchEnd)
    },
    render() {
        const {
            handleTouchStart,
            handleTouchMove,
            handleTouchEnd,
            isDragging,
            clickFunction
        } = this

        return <div class={styles.draggable}
                    onTouchstart={handleTouchStart}
                    onTouchmove={handleTouchMove}
                    onTouchend={handleTouchEnd}
                    onMousedown={handleTouchStart}
                    onClick={clickFunction}
                    style={{ cursor: isDragging ? 'grabbing' : 'grab' }}>{this.$slots.default}</div>
    }
}
