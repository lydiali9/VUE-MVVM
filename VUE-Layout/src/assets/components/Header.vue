<template>
    <el-header>
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-menu-item index="1">TabA</el-menu-item>
            <el-submenu index="2">
                <template slot="title">TabB</template>
                <el-menu-item index="2-1">TabB_1</el-menu-item>
                <el-menu-item index="2-2">TabB_2</el-menu-item>
                <el-menu-item index="2-3">TabB_3</el-menu-item>

                <!-- <el-submenu index="3">
                    <template slot="title">TabC</template>
                    <el-menu-item index="3-1">TabC_1</el-menu-item>
                    <el-menu-item index="3-2">TabC_2</el-menu-item>
                    <el-menu-item index="3-3">TabC_3</el-menu-item>
                </el-submenu> -->
            </el-submenu>
            <el-menu-item index="3">TabC</el-menu-item>
            <el-menu-item index="4">TabD</el-menu-item>
            <el-menu-item index="5">TabE</el-menu-item>
        </el-menu>
    </el-header>
</template>
<script>
export default {
    props: {
        activeIndex: {
            type: String,
            default: '1'
        }
    },
    data() {
        return {
            // activeIndex: '1',
        };
    },
    methods: {
        handleSelect(key, keyPath) {
            this.$emit('handleTab', key);
        }
    }
}
</script>
<style>
</style>