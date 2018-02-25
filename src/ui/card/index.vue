<template>
    <div :class="[[$style.card], { [$style.rounded]: rounded }]">
        <div v-if="title" :class="$style.title">{{ title }}</div>
        <slot/>
    </div>
</template>
<script>
    export default {
        name: 'card',
        props: {
            title: String,
            rounded: {
                type: Boolean,
                default: false
            }
        }
    }
</script>
<style module>
    @value White-500 from '@/common/colors.css';
    .card {
        box-shadow: 0 1px 6px rgba(0,0,0,.117647), 0 1px 4px rgba(0,0,0,.117647);
        background: White-500;
        border-radius: 2px;
    }
    .rounded {
        border-radius: 50%;
    }
</style>
