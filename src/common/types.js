// @flow
import WindowClass from '../classes/Window'

export type Script = {
    fields: any[],
    init: () => void,
    update: () => void
}

export type Vector3 = {
    x: number,
    y: number,
    z: number
}

export type DesktopType = {
    windows: WindowClass[]
}
