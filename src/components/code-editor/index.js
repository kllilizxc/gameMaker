import styles from './style.css'

import * as monaco from 'monaco-editor'

self.MonacoEnvironment = {
    getWorkerUrl: function (moduleId, label) {
        if (label === 'json') {
            return './json.worker.bundle.js'
        }
        if (label === 'css') {
            return './css.worker.bundle.js'
        }
        if (label === 'html') {
            return './html.worker.bundle.js'
        }
        if (label === 'typescript' || label === 'javascript') {
            return './ts.worker.bundle.js'
        }
        return './editor.worker.bundle.js'
    }
}

export default {
    name: 'code-editor',
    mounted() {
        monaco.editor.create(this.$refs.container, {
            value: '',
            language: 'javascript'
        })
    },
    render() {
        return <div style="width:800px;height:600px;border:1px solid #ccc" ref='container'/>
    }
}
