// @flow
// @jsx h
import styles from './style.css'
import Desktop from '@/components/desktop'
import Window from '@/components/window'
import FloatButton from '@/ui/float-button'
import Hideable from '@/ui/hideable'
import WindowLabel from '@/components/window-label'
import type { DesktopType } from '@/common/types'
import WindowClass from '../../classes/Window'

export const MAX_SIZE = 4
export const CONTAINER_SIZE = window.innerWidth

function sizeToPX(size = 1) {
    return size * CONTAINER_SIZE/ MAX_SIZE
}

function getMaxSizeOfTheRightMostWindow(windows: WindowClass[], rightMostSize: number): number {
    return Math.max(MAX_SIZE - windows.length, rightMostSize)
}

function setWindowsSizeIndesktop(windows: WindowClass[]): void {
    console.assert(windows.length <= 4)

    for (let i = windows.length - 1; i >= 0; --i) {
        const rightMostWindow = windows[i]
        const remainWindows = windows.splice(0, i)
        rightMostWindow.size = getMaxSizeOfTheRightMostWindow(remainWindows, rightMostWindow.size)
    }
}

export default {
    name: 'desktop-manager',
    props: {
        windows: Array,
        defaultWindow: {
            type: Object,
            required: true
        }
    },
    data: () => ({
        movingWindow: null,
        currentViewDesktopIndex: 0,
        windowHintSize: 0,
        shouldUpdateDesktops: false
    }),
    watch: {},
    methods: {
        updateDesktops() {
            this.shouldUpdateDesktops = !this.shouldUpdateDesktops
        },
        gotoLastDesktop(): void {
            if (!this.isViewingFirstDesktop)
                --this.currentViewDesktopIndex
        },
        gotoNextDesktop(): void {
            if (!this.isViewingLastDesktop)
                ++this.currentViewDesktopIndex
        },
        handleCreateNewWindow(window: WindowClass): void {
            this.windows.push(window)
            this.movingWindow = window
            this.movingWindow.setRef(this.getWindowRef(window.title))
            this.movingWindow.startMoving()
        },
        handleMovingExistingWindow(name: string): void {
            this.movingWindow = this.windows.find(({ title }) => title === name)
            this.movingWindow.startMoving()
        },
        handleMovingWindow(deltaX: number): void {
            if (!this.movingWindow) return
            this.movingWindow.move(-deltaX)
        },
        handleReleaseWindow(deltaX: number): void {
            if (!this.movingWindow) return
            this.updateDesktops()
            // this.movingWindow.release(-deltaX, CONTAINER_SIZE MAX_SIZE)
        },
        getWindowRef(name: string): any {
            console.log('getWindowRef', this.$refs, name)
            return this.$refs.windows.find(({ window: { title } }) => title === name)
        }
    },
    computed: {
        desktops(): DesktopType[] {
            console.log('update desktop')
            const { windows, defaultWindow, shouldUpdateDesktops } = this
            const unfoldWindows = [defaultWindow].concat(windows.filter(({ isFolded }) => !isFolded))
            let desktops = []
            let currentDesktop

            // if window size is MAX_SIZE (4 in this case), then it should be placed in a new window, else put it in the current window
            for (let i = 0, counter = 0; i < unfoldWindows.length; ++i) {
                const window = unfoldWindows[i]

                if (i === 0 || window.size === MAX_SIZE || counter >= MAX_SIZE) {
                    // if should create a new desktop
                    currentDesktop = { windows: [window] }
                    desktops.push(currentDesktop)
                    counter = 0
                } else {
                    // else put current window into current desktop
                    currentDesktop && currentDesktop.windows && currentDesktop.windows.push(window)
                    counter++
                }
            }

            // reset windows' size in desktops
            desktops = desktops.map(desktop => {
                setWindowsSizeIndesktop(desktop.windows)
                return desktop
            })

            return desktops
        },
        windowLabels(): WindowClass[] {
            const { windows } = this
            return windows.filter(({ isFolded }) => isFolded)
        },
        isViewingFirstDesktop(): boolean {
            return this.currentViewDesktopIndex === 0
        },
        isViewingLastDesktop(): boolean {
            return this.currentViewDesktopIndex === this.desktops.length - 1
        }
    },
    render(h: any): any {
        const {
            // state
            desktops,
            movingWindow,
            windowLabels,
            // methods
            handleCreateNewWindow,
            handleMovingExistingWindow,
            handleMovingWindow,
            handleReleaseWindow,

            currentViewDesktopIndex,
            gotoLastDesktop,
            gotoNextDesktop,
            isViewingFirstDesktop,
            isViewingLastDesktop,

            windowHintSize
        } = this

        console.log(desktops)

        return <div class={styles.desktopManager}>
            {desktops && desktops.map(({ windows }) =>
                <Desktop>{windows && windows.map(window =>
                    <Window ref="windows"
                            refInFor={true}
                            window={window}
                            key={window.title}
                            onStartDraggingWindow={handleMovingExistingWindow}
                            onDraggingWindow={handleMovingWindow}
                            onDraggingWindowEnd={handleReleaseWindow}/>
                )}</Desktop>)}
            <div class={styles.fixedUI} style={{ transform: `translateX(${currentViewDesktopIndex * 100}vw)` }}>
                <div class={styles.windowHint} ref="windowHint" style={{
                    opacity: movingWindow ? '' : '0',
                    width: `${sizeToPX(windowHintSize)}px`
                }}/>
                <div class={styles.windowLabelList}>
                    {windowLabels.map(label => <WindowLabel label={label}
                                                            key={label.title}
                                                            onNewWindow={handleCreateNewWindow}
                                                            onMovingWindow={handleMovingWindow}
                                                            onMovingWindowEnd={handleReleaseWindow}/>)}
                </div>
                {!isViewingFirstDesktop && <Hideable class={styles.toLeftButton} hideFunction={leftButtonHide}>
                    <FloatButton mini
                                 icon="keyboard_arrow_left"
                                 onClick={gotoLastDesktop}/></Hideable>}
                {!isViewingLastDesktop && <Hideable class={styles.toRightButton} hideFunction={rightButtonHide}>
                    <FloatButton mini
                                 icon="keyboard_arrow_right"
                                 onClick={gotoNextDesktop}/></Hideable>}

            </div>
        </div>
    }
}

function leftButtonHide(style: any): void {
    style.transform = 'translateX(-50px)'
}

function rightButtonHide(style: any): void {
    style.transform = 'translateX(50px)'
}
