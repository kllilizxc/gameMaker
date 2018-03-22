import Explorer from '@/components/explorer'
import { mapGetters } from 'vuex'
import path from 'path'

export default {
    name: 'explorer-window',
    computed: mapGetters(['filename']),
    render() {
        return <Explorer path={this.filename && path.join(this.filename, '..')}/>
    }
}

