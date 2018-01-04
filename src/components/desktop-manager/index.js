// @flow
// @jsx h
import styles from './style.css'
import Desktop from '@/components/desktop'
import Window from '@/components/window'
import FloatButton from '@/ui/float-button'
import Hideable from '@/ui/hideable'
import WindowLabel from '@/components/window-label'
import { afterTransition } from '../../common/util'
import type { DesktopType, WindowType } from '@/common/types'

export const MAX_SIZE = 4

function sizeToPX(size = 1) {
    return size * window.innerWidth / MAX_SIZE
}

function getMaxSizeOfTheRightMostWindow(windows: WindowType[], rightMostSize: number): number {
    return Math.max(MAX_SIZE - windows.length, rightMostSize)
}

function setWindowsSizeIndesktop(windows: WindowType[]): void {
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
        currentMovingWindow: null,
        currentViewDesktopIndex: 0,
        windowHintSize: 0
    }),
    watch: {},
    methods: {
        gotoLastDesktop(): void {
            if (!this.isViewingFirstDesktop)
                --this.currentViewDesktopIndex
        },
        gotoNextDesktop(): void {
            if (!this.isViewingLastDesktop)
                ++this.currentViewDesktopIndex
        },
        handleCreateNewWindow(window: WindowType): void {},
        handleMovingNewWindow(deltaX: number): void {},
        handleReleaseNewWindow(deltaX: number): void {},
        handleMovingExistingWindow(name: string): void {}

    },
    computed: {
        desktops(): DesktopType[] {
            const { windows, defaultWindow } = this
            const unfoldWindows = [defaultWindow].concat(windows.filter(({ isFolded }) => !isFolded))
            let desktops = [], currentDesktop

            // if window size is MAX_SIZE (4 in this case), then it should be placed in a new window, else put it in the current window
            for (let i = 0, counter = 0; i < unfoldWindows.length; ++i) {
                let window = unfoldWindows[i]

                if (i === 0 || window.size === MAX_SIZE || counter >= MAX_SIZE) {
                    // if should create a new window
                    currentDesktop = { windows: [window] }
                    desktops.push(currentDesktop)
                } else {
                    // else put current window into current desktop
                    currentDesktop && currentDesktop.windows && currentDesktop.windows.push(window)
                }
            }

            // reset windows' size in desktops
            desktops = desktops.map(desktop => {
                setWindowsSizeIndesktop(desktop.windows)
                return desktop
            })

            return desktops
        },
        windowLabels(): WindowType[] {
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
            currentMovingWindow,
            windowLabels,
            // methods
            handleCreateNewWindow,
            handleMovingExistingWindow,
            handleMovingNewWindow,
            handleReleaseNewWindow,

            currentViewDesktopIndex,
            gotoLastDesktop,
            gotoNextDesktop,
            isViewingFirstDesktop,
            isViewingLastDesktop,

            windowHintSize
        } = this

        return <div class={styles.desktopManager}>
            {desktops && desktops.map(({ windows }) =>
                <Desktop>{windows && windows.map(window =>
                    <Window ref="windows"
                            refInFor={true}
                            window={window}
                            key={window.title}
                            onStartDraggingWindow={handleMovingExistingWindow}
                            onDraggingWindow={handleMovingNewWindow}
                            onDraggingWindowEnd={handleReleaseNewWindow}
                            style={!window.isMoving && { flex: window.size }}>{window.content}</Window>
                )}</Desktop>)}
            <div class={styles.fixedUI} style={{ transform: `translateX(${currentViewDesktopIndex * 100}vw)` }}>
                <div class={styles.windowHint} ref="windowHint" style={{
                    opacity: currentMovingWindow ? '' : '0',
                    width: `${sizeToPX(windowHintSize)}px`
                }}/>
                <div class={styles.windowLabelList}>
                    {windowLabels.map(label => <WindowLabel label={label}
                                                            key={label.title}
                                                            onNewWindow={handleCreateNewWindow}
                                                            onMovingWindow={handleMovingNewWindow}
                                                            onMovingWindowEnd={handleReleaseNewWindow}/>)}
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
