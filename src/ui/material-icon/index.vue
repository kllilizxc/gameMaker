<template>
    <mu-icon :class="$style.icon" :value="value" :color="color" :size="size"/>
</template>
<script>
    export default {
        name: 'icon',
        props: {
            value: String,
            color: String,
            size: Number
        }
    }
</script>
<style module>
    .icon {
        user-select: none;
    }
</style>
