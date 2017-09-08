<template>
    <mu-card :class="$style.card">
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
            }
        }
    }
</script>
<style module>
    .container {
        overflow: auto;
    }
</style>
