<template>
    <mu-icon-button
        :icon="icon"
        :iconClass="iconClass"
        :disabled="disabled"
        @click="handleClick"/>
</template>
<script>
    export default {
        name: 'icon-button',
        props: {
            icon: String,
            iconClass: String,
            disabled: Boolean
        },
        methods: {
            handleClick(e) {
                this.$emit('click', e)
            }
        }
    }
</script>
