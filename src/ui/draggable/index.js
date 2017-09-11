// @flow

export default {
    name: 'draggable',
    props: {
        touchStart: Function,
        touchMove: Function,
        touchEnd: Function,
        dragLimit: {
            type: Number,
            default: window.innerWidth
        }
    },
    data: () => ({
        isDragging: false,
        lastX: 0,
        deltaX: 0
    }),
    methods: {
        handleTouchStart(e): void {
            this.lastX = e.clientX || e.touches[0].clientX
            this.isDragging = true
            this.touchStart()
        },
        handleTouchMove(e): void {
            e.stopPropagation()
            e.preventDefault()

            if (!this.isDragging) return
            const clientX = e.clientX || e.touches[0].clientX
            this.deltaX += clientX - this.lastX
            this.lastX = clientX

            if (this.isDragging && this.deltaX < 8 && this.deltaX > this.dragLimit)
                this.touchMove(this.deltaX)
        },
        handleTouchEnd(e): void {
            if (this.isDragging)
                this.touchEnd(this.deltaX, () => this.isDragging = false)
        }
    },
    render() {
        const {
            handleTouchStart,
            handleTouchMove,
            handleTouchEnd
        } = this

        return <div onTouchstart={handleTouchStart}
                    onTouchmove={handleTouchMove}
                    onTouchend={handleTouchEnd}
                    onMousedown={handleTouchStart}
                    onMousemove={handleTouchMove}
                    onMouseleave={handleTouchEnd}
                    onMouseup={handleTouchEnd}>{this.$slots.default}</div>
    }
}
