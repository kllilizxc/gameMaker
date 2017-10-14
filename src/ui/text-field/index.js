// @flow
import { getFunctionalUIComponent } from '../../common/util'

export default getFunctionalUIComponent('mu-text-field',
    {
        type: String,
        icon: String,
        label: String,
        labelFloat: Boolean,
        disabled: Boolean,
        hintText: String,
        errorText: String,
        underlineShow: Boolean,
        multiLine: Boolean,
        rows: Number,
        rowsMax: Number,
        maxLength: Number,
        value: String,
        max: Number,
        min: Number
    })
