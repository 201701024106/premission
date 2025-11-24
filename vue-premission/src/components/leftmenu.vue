<template>
    <div class="ti-leftmenu-container">
        <el-menu :default-active="defaultActive" v-bind="$attrs" :router="router" class="el-menu-vertical-demo">
            <template v-for="item in data">
                <el-menu-item v-if="!item[childrenKey] || !item[childrenKey].length" :index="item[indexKey]"
                    :key="item[labelKey]">
                    <span>{{ item[labelKey] }}</span>
                </el-menu-item>
                <el-sub-menu v-if="item[childrenKey] && item[childrenKey].length" :index="item[indexKey]"
                    :key="item[labelKey]">
                    <template #title>
                        <span>{{ item[labelKey] }}</span>
                    </template>
                    <el-menu-item v-for="(item1) in item[childrenKey]" :index="item1.index" :key="item1.name">
                        <span>{{ item1[labelKey] }}</span>
                    </el-menu-item>
                </el-sub-menu>
            </template>
        </el-menu>
    </div>
</template>

<script setup lang="ts">
import {  defineProps, PropType } from 'vue';
import { menuItem } from "./types"
const props = defineProps({
    data: {
        type: Array as PropType<menuItem[]>,
        required: true,
        default: () => []
    },
    defaultActive: {
        type: String,
        default: ''
    },
    // 是否是路由模式
    router: {
        type: Boolean,
        default: false
    },
    // 标题的键名
    labelKey: {
        type: String,
        default: 'name'
    },
    // 标题的键名
    iconKey: {
        type: String,
        default: 'icon'
    },
    // 标题的键名
    indexKey: {
        type: String,
        default: 'index'
    },
    // 子菜单的键名
    childrenKey: {
        type: String,
        default: 'children'
    }
});

</script>

<style scoped lang="scss">
.ti-leftmenu-container {
    height: 100%;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    height: 100%;
}

svg {
    width: 1em;
    height: 1em;
}
</style>