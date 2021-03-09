<template>
    <el-dialog
        append-to-body
        :width="width"
        :top="top"
        :close-on-click-modal="false"
        :visible.sync="dialogVisible" :fullscreen="fullscreen"
        class="avue-dialog avue-crud__dialog">
        <div slot="title"
             class="avue-crud__dialog__header">
            <span class="el-dialog__title">{{title}}</span>
            <div class="avue-crud__dialog__menu">
                <i @click="fullscreen=!fullscreen"
                   class="el-dialog__close el-icon-full-screen"></i>
            </div>
        </div>
        <el-scrollbar wrap-class="scrollbar-wrapper-dialog">
            <slot></slot>
        </el-scrollbar>
    </el-dialog>
</template>

<script>
    export default {
        props:['title','visible','width','top'],
        name: "publicDialog",
        data() {
            return {
                fullscreen:false,
            }
        },
        computed:{
            dialogVisible:{
                get(){
                    return this.visible
                },
                set(val){
                    this.$emit('update:visible',val)
                }
            }
        },
        methods: {}
    }
</script>

<style scoped>

</style>