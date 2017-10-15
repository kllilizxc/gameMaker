// @flow
import fs from 'fs'

export function readFile(filename: string): Promise {
    return new Promise(function (resolve, reject) {
        fs.readFile(filename, function (err, data) {
            if (err)
                reject(err)
            else
                resolve(data)
        })
    })

}

export function readFileSync(filename: string): string {
    return fs.readFileSync(filename)
}

export function writeFile(filename: string, value: string): void {
    return new Promise((resolve, reject) =>
        fs.writeFile(filename, value, (err) => {
            if (err) reject()
            else resolve()
        }))
}
