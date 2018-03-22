<template>
    <div :class="$style.dock">
        <hideable :class="$style.container" :hideFunction="hide" :isLocked="isLocked">
            <card :class="$style.card">
                <div :class="$style.left">
                    <slot name="left"/>
                </div>
                <div :class="$style.right">
                    <slot name="right"/>
                    <icon-button icon="eject" @click="toggleLock" :class="{ [$style.isLocked]: isLocked, [$style.rightTool]: true }"/>
                </div>
            </card>
        </hideable>
    </div>
</template>
<script src="./index.js"></script>
<style module src="./style.css"></style>
