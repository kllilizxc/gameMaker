// @flow
import Card from '@/ui/card'

export default {
    name: 'dock',
    components: { Card },
    props: {
        tools: {
            type: Array,
            required: true
        }
    }
}
