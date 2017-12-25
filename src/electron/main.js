import { app, BrowserWindow } from 'electron'
import path from 'path'

let mainWindow
const winURL = process.env.NODE_ENV === 'production'
    ? path.join(`file://${__dirname}`, '../web/index.html')
    : 'http://localhost:9080'

console.log(winURL)
function createWindow () {
    /**
     * Initial window options
     */
    mainWindow = new BrowserWindow({
        height: 1080,
        useContentSize: true,
        width: 1920
    })

    mainWindow.loadURL(winURL)

    mainWindow.on('closed', () => {
        mainWindow = null
    })

    if (process.env.NODE_ENV !== 'production')
        mainWindow.webContents.openDevTools()
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})

