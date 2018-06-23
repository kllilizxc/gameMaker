// @flow
// @jsx h
import styles from './style.css'
import Window from '@/components/window'
import FloatButton from '@/ui/float-button'
import Hideable from '@/ui/hideable'
import WindowLabel from '@/components/window-label'
import labelStyles from '../window-label/style.css'
import windowStyles from '../window/style.css'
import { afterTransition } from '../../common/util'

export const MAX_SIZE: number = 4

function sizeToPX(size = 1) {
    return size * window.innerWidth / MAX_SIZE
}

export default {
    name: 'desktop-manager',
    props: {
        windowLabels: Array,
        defaultWindow: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            windows: [this.defaultWindow],
            desktopIndicators: [0],
            currentDesktopIndex: 0,
            windowHintSize: 0,
            lastWindowWidth: 0,
            selectedLabel: null,
            selectedWindow: null,
            lastX: 0,
            clientX: 0
        }
    },
    watch: {
        currentDesktopIndex(index: number): void {
            if (this.$el && this.$el.style)
                this.$el.style.transform = `translateX(${-100 * index}vw)`
        }
    },
    methods: {
        gotoLastDesktop(): void {
            if (this.currentDesktopIndex > 0)
                --this.currentDesktopIndex
        },
        gotoNextDesktop(): void {
            if (this.currentDesktopIndex < this.desktopIndicators.length - 1)
                ++this.currentDesktopIndex
        },
        translateCurrentWindow(translateWidth: number, callback: () => void): void {
            const currentWindowRef = this.$refs.windows[this.currentWindowIndex].$el
            const style = currentWindowRef.style
            if (translateWidth === currentWindowRef.offsetWidth) {
                callback && callback()
            } else {
                afterTransition(currentWindowRef, () => {
                    style.transition = 'none'
                    callback && callback()
                })
                style.transition = 'width 0.3s ease'
                style.width = `${translateWidth}px`
            }
        },
        setCurrentWindowSize(size: number): void {
            const { windows } = this
            const startIndex = this.desktopIndicators[this.currentDesktopIndex]
            const endIndex = this.currentDesktopIndex === this.desktopIndicators.length - 1
                ? this.windows.length - 1
                : this.desktopIndicators[this.currentDesktopIndex + 1]

            const movingWindow = windows[endIndex]

            let sizeToChange = windows.slice(startIndex, endIndex).reduce((cur, { size }) => cur + size, 0) + size - MAX_SIZE
            if (this.lastWindowWidth === 0) sizeToChange -= movingWindow.size
            for (let i = endIndex - 1; i >= startIndex; --i) {
                const window = windows[i]
                if (window.size > sizeToChange) {
                    window.size -= sizeToChange
                    break
                } else {
                    sizeToChange -= (window.size - 1)
                    window.size = 1
                }
            }
            movingWindow.size = size
        },
        resetWindowHint(size: number = 0): void {
            this.$refs.windowHint.style.transition = 'none'
            this.windowHintSize = size
        },
        firstWindowInDesktopTakeSpareSpace(size) {
            const windowIndex = this.desktopIndicators[this.currentDesktopIndex]
            this.windows[windowIndex].size += size
        },
        createNewDesktopToFitWindow(): void {
            this.firstWindowInDesktopTakeSpareSpace(this.currentWindow.size)
            this.currentWindow.size = MAX_SIZE
            this.desktopIndicators.push(this.currentWindowIndex)
            this.resetWindowHint(MAX_SIZE)
            this.$refs.windowHint.style.transition = ''
            this.gotoNextDesktop()
        },
        resizeWindow(title) {
            this.currentWindowIndex = this.windows.findIndex(window => window.title === title)
            if (this.currentWindowIndex !== this.windows.length - 1) {
                this.currentWindowIndex = -1 // only the last window is draggable
                return
            }
            this.windows[this.currentWindowIndex].isMoving = true
            this.lastWindowWidth = this.$refs.windows[this.currentWindowIndex].$el.offsetWidth
            this.resetWindowHint(this.getWindowSizeByDeltaX(this.lastWindowWidth))
        },
        createWindow(title) {
            const label = this.windowLabels.find(label => label.title === title)
            const currentWindow = { ...label, size: 0, isMoving: true }
            this.currentWindowIndex = this.windows.length
            this.windows.push(currentWindow)
            this.lastWindowWidth = 0
        },
        moveWindow(width) {
            if (this.currentWindowIndex === -1) return
            this.$refs.windowHint.style.transition = ''
            this.$refs.windows[this.currentWindowIndex].$el.style.width = `${width}px`
            this.windowHintSize = this.getWindowSizeByDeltaX(width)
        },
        releaseWindow() {
            if (this.currentWindowIndex === -1) return
            const size = this.getWindowSizeByDeltaX(this.lastWindowWidth - this.deltaX)
            if (size === 0 || this.isLastWindowInDesktop) {
                // to remove the window
                this.translateCurrentWindow(0, () => {
                    if (this.lastWindowWidth !== 0) { // is existing window
                        const { icon, title, color, content } = this.currentWindow
                        this.windowLabels.push({ icon, title, color, content })
                    }
                    if (this.isLastWindowInDesktop) {
                        // if currentDesktop would be empty
                        this.gotoLastDesktop()
                        this.desktopIndicators.pop()
                    } else
                        this.firstWindowInDesktopTakeSpareSpace(this.currentWindow.size)
                    this.removeCurrentWindow()
                    this.windowHintSize = 0
                })
            } else {
                // to create or change the size of the window
                const handleTransitionEnd = () => {
                    this.windowHintSize = 0
                    this.windows[this.currentWindowIndex].isMoving = false
                    this.currentWindowIndex = -1
                }

                if (this.lastWindowWidth === 0) // remove label
                    this.windowLabels.splice(this.windowLabels.findIndex(label => label.title === this.currentWindow.title), 1)

                const desktopSize = this.getDesktopSize()
                if (desktopSize === 0 || desktopSize > MAX_SIZE || size + desktopSize - 1 > MAX_SIZE) {
                    // create a new window
                    this.createNewDesktopToFitWindow()
                    handleTransitionEnd()
                } else {
                    this.translateCurrentWindow(sizeToPX(size), () => {
                        handleTransitionEnd()
                        this.setCurrentWindowSize(size)
                    })
                }
            }
        },
        removeCurrentWindow(): void {
            const { windows } = this
            windows.splice(windows.length - 1, 1)
            this.currentWindowIndex = -1
        },
        getWindowSizeByDeltaX(deltaX) {
            const absDeltaX = Math.abs(deltaX)
            const blockWidth = sizeToPX()
            return Math.min(Math.ceil((absDeltaX - blockWidth / 2) / blockWidth), MAX_SIZE)
        },
        startDrag(e) {
            const { target } = e
            if (target.classList.contains(labelStyles.label)) {
                this.selectedLabel = target
                this.createWindow(this.selectedLabel.dataset.title)
            } else if (target.classList.contains(windowStyles.title)) {
                this.selectedWindow = target
                this.resizeWindow(this.selectedWindow.dataset.title)
            } else {
                this.selectedWindow = null
                this.selectedLabel = null
                return
            }

            this.lastX = e.clientX || (e.touches && e.touches[0].clientX)
            this.deltaX = 0
            this.$store.dispatch('setIsLoading', true)
        },
        drag(e) {
            if (!this.selectedLabel && !this.selectedWindow) return

            e.preventDefault()
            e.stopPropagation()

            const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0
            this.deltaX += clientX - this.lastX
            this.lastX = clientX

            const isDragging = Math.abs(this.deltaX) > 8
            const dragMax = this.lastWindowWidth, dragMin = -window.innerWidth
            if (isDragging && this.deltaX < dragMax && this.deltaX > dragMin) {
                // do something
                const relativeDeltaX = Math.max(0, this.lastWindowWidth - this.deltaX)
                if (this.selectedLabel) this.selectedLabel.style.transform = `translateX(${-relativeDeltaX}px)`
                this.moveWindow(relativeDeltaX)
            }
        },
        endDrag(e) {
            if ((!this.selectedLabel && !this.selectedWindow)) return
            this.releaseWindow()
            if (this.selectedLabel)
                this.selectedLabel.style.transform = ''
            this.selectedLabel = null
            this.selectedWindow = null
            this.$store.dispatch('setIsLoading', false)
        },
        getDesktopSize() {
            if (this.currentDesktopIndex === this.desktopIndicators.length - 1)
                return this.windows.length - this.desktopIndicators[this.currentDesktopIndex]
            else
                return this.desktopIndicators[this.currentDesktopIndex + 1] - this.desktopIndicators[this.currentDesktopIndex]
        }
    },
    computed: {
        isFirstDesktop(): boolean {
            return this.currentDesktopIndex === 0
        },
        isLastDesktop(): boolean {
            return this.currentDesktopIndex === this.desktopIndicators.length - 1
        },
        currentWindow() {
            return this.windows[this.currentWindowIndex]
        },
        isLastWindowInDesktop() {
            return this.currentWindowIndex === this.desktopIndicators[this.currentDesktopIndex]
        }
    },
    render(h) {
        const {
            windows,
            desktopIndicators,
            windowLabels,
            currentDesktopIndex,
            currentWindowIndex,
            gotoLastDesktop,
            gotoNextDesktop,
            isFirstDesktop,
            isLastDesktop,
            windowHintSize,
            // drag
            startDrag,
            drag,
            endDrag
        } = this

        return <div class={styles.desktopManager}
                    style={{ width: `${desktopIndicators.length * 100}vw` }}
                    onMousedown={startDrag}
                    onMousemove={drag}
                    onMouseleave={endDrag}
                    onMouseup={endDrag}>
            {windows.map(window =>
                <Window ref="windows"
                        refInFor={true}
                        window={window}
                        key={window.title}
                        style={!window.isMoving && { flex: window.size }}>{window.content}</Window>)}
            <div class={styles.fixedUI} style={{ transform: `translateX(${currentDesktopIndex * 100}vw)` }}>
                {<div class={styles.windowHint} ref="windowHint" style={{
                    opacity: currentWindowIndex !== -1 ? '' : '0',
                    width: `${sizeToPX(windowHintSize)}px`
                }}/>}
                <div class={styles.windowLabelList}>
                    {windowLabels.map(label => <WindowLabel label={label}
                                                            class={styles.label}
                                                            key={label.title}/>)}
                </div>
                {!isFirstDesktop && <Hideable class={styles.toLeftButton} hideFunction={leftButtonHide}>
                    <FloatButton small
                                 color={'secondary'}
                                 icon="keyboard_arrow_left"
                                 onClick={gotoLastDesktop}/></Hideable>}
                {!isLastDesktop && <Hideable class={styles.toRightButton} hideFunction={rightButtonHide}>
                    <FloatButton small
                                 color={'secondary'}
                                 icon="keyboard_arrow_right"
                                 onClick={gotoNextDesktop}/></Hideable>}

            </div>
        </div>
    }
}

function leftButtonHide(style) {
    style.transform = 'translateX(-36px)'
}

function rightButtonHide(style) {
    style.transform = 'translateX(36px)'
}
