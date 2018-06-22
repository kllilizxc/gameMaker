<template>
    <mu-button icon @click="handleClick">
        <mu-icon :value="icon"
                 :color="color"
                 :iconClass="iconClass"
                 :disabled="disabled"/>
    </mu-button>
</template>
<script>
    export default {
        name: 'icon-button',
        props: {
            icon: String,
            iconClass: String,
            disabled: Boolean,
            color: String
        },
        methods: {
            handleClick(e) {
                this.$emit('click', e)
            }
        }
    }
</script>
