<template>
    <div class="dock-item">
        <icon-button :icon="icon" :disabled="disabled" @click="clickHandler"/>
    </div>
</template>
<script>
    //    @flow
    import iconButton from '@/ui/material-icon-button'

    export default {
        name: 'dock-item',
        components: { iconButton },
        props: {
            icon: String,
            disabled: Boolean
        },
        methods: {
            clickHandler(e) {
                this.$emit('click', e)
            }
        }
    }
</script>
<style scoped>
    .dock-item {
        margin: 8px;
    }
</style>
