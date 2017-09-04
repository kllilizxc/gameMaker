// @flow
import Card from '@/components/card'

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
