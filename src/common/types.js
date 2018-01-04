// @flow
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

export type GameObject = {
    uuid: string,
    name: string,
    position: Vector3,
    rotation: Vector3,
    scale: Vector3,
    scripts: Script[],
    visible: boolean,
    type: string,
    raw: any
}

export type WindowType = {
    title: string,
    content: any,
    icon: string,
    color: 'string',
    size: number,
    isFolded: boolean
}

export type DesktopType = {
    windows: WindowType[]
}
