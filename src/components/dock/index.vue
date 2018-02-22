<template>
    <div :class="$style.dock">
        <hideable :class="$style.container" :hideFunction="hide" :isLocked="isLocked">
            <card :class="$style.card">
                <div :class="$style.left">
                    <dock-item :class="$style.leftTool"
                               v-for="tool in leftTools"
                               :icon="tool.icon"
                               :key="tool.icon"
                               :disabled="tool.disabled"
                               @click="tool.clickHandler"/>
                </div>
                <div :class="$style.right">
                    <dock-item icon="eject" @click="toggleLock" :class="{ [$style.isLocked]: isLocked, [$style.rightTool]: true }"/>
                    <dock-item :class="$style.rightTool"
                               v-for="tool in rightTools"
                               :icon="tool.icon"
                               :key="tool.icon"
                               :disabled="tool.disabled"
                               @click="tool.clickHandler"/>
                </div>
            </card>
        </hideable>
    </div>
</template>
<script src="./index.js"></script>
<style module src="./style.css"></style>
