export default {
    name: 'asset-window',
    props: {
        initialPath: String
    },
    data() {
        return {
            currentPath: this.initialPath || ''
        }
    },
    computed: {
        files() {
            const { currentPath } = this
        }
    }
}
