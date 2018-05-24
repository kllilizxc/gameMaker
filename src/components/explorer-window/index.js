import Explorer from '@/components/explorer'
import { mapGetters } from 'vuex'

export default {
    name: 'explorer-window',
    computed: mapGetters(['filename']),
    render() {
        return <Explorer/>
    }
}

