<template>
    <mu-card :class="{[$style.card]: true, [$style.rounded]: rounded}">
        <div :class="$style.container">
            <div :class="$style.header" v-if="title">
                <mu-card-title :title="title" :sub-title="subTitle"/>
            </div>
            <slot/>
        </div>
    </mu-card>
</template>
<script>
    // @flow
    export default {
        name: 'card',
        props: {
            title: {
                type: String,
                default: ''
            },
            subTitle: {
                type: String,
                default: ''
            },
            rounded: {
                type: Boolean,
                default: false
            }
        }
    }
</script>
<style module>
    .container {
        user-select: none;
        width: 100%;
        height: 100%;
    }
    .rounded {
        border-radius: 50%;
    }
</style>
