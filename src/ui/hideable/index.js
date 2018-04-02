// @flow
import { afterTransition } from '@/common/util'

export default {
    name: 'hideable',
    props: {
        hideFunction: {
            type: Function,
            required: true
        },
        showFunction: {
            type: Function,
            default: style => style.transform = ''
        },
        isLocked: {
            type: Boolean,
            default: false
        },
        clickFunction: {
            type: Function,
            default: e => null
        }
    },
    data: () => ({
        isHide: true
    }),
    mounted() {
        if (!this.isLocked)
            this.hideFunction(this.toHide.style)
    },
    computed: {
        toHide() {
            return this.$refs.toHide.$el || this.$refs.toHide
        }
    },
    methods: {
        hide(): void {
            if (this.isHide) return
            this.hideFunction(this.toHide.style)
            afterTransition(this.toHide, () => {
                if (!this.isHide)
                    this.show()
                else
                    this.isHide = true
            })
        },
        show(): void {
            if (!this.isHide) return
            this.showFunction(this.toHide.style)
            afterTransition(this.toHide, () => {
                if (this.isHide)
                    this.hide()
                else
                    this.isHide = false
            })
        },
        toggle(): void {
            this.isHide ? this.show() : this.hide()
        },
        handleMouseEnter(): void {
            if (this.isLocked) return
            if (this.isHide)
                this.show()
            this.isHide = false
        },
        handleMouseLeave(): void {
            if (this.isLocked) return
            if (!this.isHide)
                this.hide()
            this.isHide = true
        }
    },
    render() {
        const {
            isLocked,
            handleMouseEnter,
            handleMouseLeave,
            clickFunction
        } = this

        return <div onMouseenter={handleMouseEnter}
                    onTouchstart={handleMouseEnter}
                    onMouseleave={handleMouseLeave}
                    onClick={clickFunction}
                    onTouchend={handleMouseLeave}
                    ref="toHide" style={{ transition: isLocked ? 'none' : 'all 0.3s ease' }}>
            {this.$slots.default}
        </div>
    }
}
