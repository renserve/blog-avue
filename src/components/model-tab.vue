<template>
    <el-tabs :tab-position="position || 'left'" :type="type==='default'?'':'card'" :value="currentModel" @tab-click="e=>$emit('tab-click',e)">
        <el-tab-pane :key="i.id" v-for="i in modelOptions" :label="i.name" :name="i.id"></el-tab-pane>
    </el-tabs>
</template>

<script>
    import {mapGetters} from 'vuex'
    export default {
        name: "modelTab",
        props:['currentModel','position','type'],
        data() {
            return {}
        },
        computed:{
            ...mapGetters(['currentMenuModel','modelOptions'])
        },
        created(){
            console.log(this.modelOptions,'this.modelOptions')
            // let tab={name:this.userInfo.usermodel.length>1?this.modelOptions[0].model:this.userInfo.usermodel[0]}
            this.$emit('tab-click',{name:this.modelOptions[0].id})
        },
        methods: {}
    }
</script>

<style scoped>

</style>