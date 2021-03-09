<template>
    <div class="user">
        <basic-container>
            <public-crud></public-crud>
        </basic-container>
    </div>

</template>

<script>
    import {Model} from '@/api/cms/super'
    import tableMixin from '@/mixins/table'
    export default {
        mixins:[tableMixin],
        name: 'SysUser',
        data(){
            return {
                groupOptions:[],
                currentModel:undefined,
                tableConfig:{
                    menuWidth:150
                },
            }
        },
        computed: {
            tableForm(){
                return [
                    {
                        label: '模块名',
                        prop: 'name',
                    },
                    {
                        label: '模块MODEL',
                        prop: 'model'
                    },
                ]
            }
        },
        async created() {

        },
        methods: {
            rowUpdateCallBack(data){
                this.modelOptions.map((item,index)=>{
                    item.model===data.model && this.modelOptions.splice(index,1,data)
                })
                this.$store.commit('SET_MODELS',this.modelOptions)
            },
            rowSaveCallBack(data){
                this.modelOptions.push(data)
                this.$store.commit('SET_MODELS',this.modelOptions)
            },
            rowDeleteCallBack(data){
                this.modelOptions.map((item,index)=>{
                    item.model===data.model && this.modelOptions.splice(index,1)
                })
                this.$store.commit('SET_MODELS',this.modelOptions)
            },
            rowUpdateApi(data){
                return new Model.put(data)
            },
            rowSaveApi(data){
                return new Model.post(data)
            },
            rowDeleteApi(id,data){
                return new Model.delete(id,data)
            },
            tableGetApi(data){
                return new Model.get(data)
            },
        }
    }
</script>
<style lang="scss">

</style>