// @flow
import { getFunctionalUIComponent } from '../../common/util'

export default getFunctionalUIComponent('mu-slider',
    {
        name: {
            type: String,
            required: true
        },
        min: Number,
        max: Number,
        step: Number,
        disabled: Boolean,
        value: Number
    })
