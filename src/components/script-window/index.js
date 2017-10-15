import { mapGetters } from 'vuex'
import Script from '../script'

import { Script } from 'Common/type'

export default {
    name: 'script-window',
    computed: {
        ...mapGetters('scripts')
    },
    render() {
        const { scripts } = this

        return <div>
            { scripts.map(script => <Script scripts={script} />) }
        </div>
    }
}
