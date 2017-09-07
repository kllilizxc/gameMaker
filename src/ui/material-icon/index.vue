<template>
    <mu-icon :value="value" :color="color" :size="size"/>
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
