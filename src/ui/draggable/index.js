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
        }
    },
    data: () => ({
        isDragging: false,
        draggingStarted: false,
        lastX: 0,
        deltaX: 0
    }),
    methods: {
        handleTouchStart(e): void {
            this.lastX = e.clientX || e.touches[0].clientX
            this.deltaX = 0
            this.isDragging = false
            this.draggingStarted = true
            this.touchStart()
        },
        handleTouchMove(e): void {
            if(!this.draggingStarted) return
            e.stopPropagation()
            e.preventDefault()

            const clientX = e.clientX || e.touches[0].clientX
            this.deltaX += clientX - this.lastX
            this.lastX = clientX

            this.isDragging = Math.abs(this.deltaX) > 8
            if (this.isDragging && this.deltaX < this.dragLimit && this.deltaX > this.dragMin)
                this.touchMove(this.deltaX)
        },
        handleTouchEnd(e): void {
            this.draggingStarted = false
            if (this.isDragging)
                this.touchEnd(this.deltaX)
        }
    },
    render() {
        const {
            handleTouchStart,
            handleTouchMove,
            handleTouchEnd,
            isDragging
        } = this

        return <div class={styles.draggable}
                    onTouchstart={handleTouchStart}
                    onTouchmove={handleTouchMove}
                    onTouchend={handleTouchEnd}
                    onMousedown={handleTouchStart}
                    onMousemove={handleTouchMove}
                    onMouseup={handleTouchEnd}
                    onMouseleave={handleTouchEnd}
                    style={{ cursor: isDragging ? 'grabbing' : 'grab' }}>{this.$slots.default}</div>
    }
}
