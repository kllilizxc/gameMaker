// @flow

import { remote } from 'electron'

const fs = remote.require('fs')

function getFunctionFromFs(func) {
    return path => new Promise((resolve, reject) => fs[func](path, (err, data) => err ? reject(err) : resolve(data)))
}

export default class AssetManager {
    static readFile = file => typeof file === 'string'
        ? fetch(file).then(response => Promise.resolve(response.text()))
        : new Promise(resolve => {
            const reader = new FileReader()
            reader.onload = e => resolve(e.target.result)
            reader.readAsText(file)
        })

    static readFileSync = async file => await this.readFile(file)

    static readLocalDir = path => new Promise((resolve, reject) => fs.readdir(path, (err, files) => {
        if (err)
            reject(err)
        else
            resolve(files)
    }))

    static readLocalStat = path => new Promise((resolve, reject) => fs.stat(path, (err, stats) => {
        if (err)
            reject(err)
        else
            resolve(stats)
    }))
}
