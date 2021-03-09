<template>
    <el-row :span="24">
        <!--userInfo.usermodel.length>1?3:0-->
        <el-col
            :xs="0"
            :sm="0"
            :md="0"
            class="user__tree">
            <slot name="left"></slot>
        </el-col>
        <el-col
            :xs="24"
            :sm="24"
            :md="24"
            class="user__main">
            <slot name="right"></slot>
        </el-col>
    </el-row>
</template>

<script>
    export default {
        name: "rowCol",
        data() {
            return {}
        },
        methods: {}
    }
</script>

<style scoped>

</style>