<template>
    <mu-card class="card">
        <div class="container">
            <div class="header" v-if="title">
                <mu-card-title :title="title" :sub-title="subTitle"/>
            </div>
            <div class="content">
                <slot/>
            </div>
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
<style scoped>
    .content {
        padding: 16px;
    }
</style>
