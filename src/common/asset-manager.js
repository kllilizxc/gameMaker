// @flow

import { remote } from 'electron'

const fs = remote.require('fs')
const ncp = remote.require('ncp')
const { dialog } = remote

function getFunctionFromFs(func) {
    return (...args) => new Promise((resolve, reject) => fs[func](...args, (err, data) => err ? reject(err) : resolve(data)))
}

export default class AssetManager {
    static readFile = file => fetch(file).then(response => Promise.resolve(response.text()))

    static readFileSync = async file => await this.readFile(file)

    static readLocalDir = path => new Promise((resolve, reject) => fs.readdir(path, (err, files) => {
        if (err)
            reject(err)
        else
            resolve(files)
    }))

    static readLocalFile = getFunctionFromFs('readFile')

    static writeFile = getFunctionFromFs('writeFile')

    static copyFile = (src, des) => fs.createReadStream(src).pipe(fs.createWriteStream(des))

    static copyDir = (src, des) => ncp(src, des, err => new Promise((resolve, reject) => err ? reject(err) : resolve()))

    static mkdir = dir => {
        if (!fs.existsSync(dir)) return getFunctionFromFs('mkdir')(dir)
        return Promise.resolve(true)
    }

    static readLocalStat = path => new Promise((resolve, reject) => fs.stat(path, (err, stats) => {
        if (err)
            reject(err)
        else
            resolve(stats)
    }))

    static pickFile = (title, options = [], filters = {}, defaultPath = '/') => new Promise((resolve, reject) =>
        dialog.showOpenDialog({ title, defaultPath, filters, properties: ['openFile', ...options] }, filePaths => {
            if (!filePaths || filePaths.length === 0) reject()
            else resolve(filePaths[0])
        }))

    static pickFiles = (title, options = [], filters = {}, defaultPath = '/') => new Promise((resolve, reject) =>
        dialog.showOpenDialog({ title, defaultPath, filters, properties: ['openFile', 'multiSelections', ...options] }, filePaths => {
            if (!filePaths || filePaths.length === 0) reject()
            else resolve(filePaths)
        }))

    static pickFolder = (title, options = [], filters = {}, defaultPath = '/') => new Promise((resolve, reject) =>
        dialog.showOpenDialog({ title, defaultPath, filters, properties: ['openDirectory', ...options] }, filePaths => {
            if (!filePaths || filePaths.length === 0) reject()
            else resolve(filePaths[0])
        }))

    static saveFile = (title, filters) => new Promise(resolve => dialog.showSaveDialog({ title, filters }, resolve))
}

