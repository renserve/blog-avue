<template>
    <div class="user">
        <basic-container>
            <row-col>
                <template #left>
                    <model-tab :currentModel="currentModel" @tab-click="tabChange"></model-tab>
                </template>
                <template #right>
                    <public-crud></public-crud>
                </template>
            </row-col>
        </basic-container>
    </div>
</template>

<script>
    import RowCol from '@/components/row-col'
    import {Friend} from '@/api/cms/friend'
    import {Model,Group} from '@/api/cms/super'
    import tableMixin from '@/mixins/table'
    export default {
        mixins:[tableMixin],
        name: 'SysUser',
        data(){
            return {
                groupOptions:[],
                currentModel:undefined,
                tableConfig:{
                    isDelayRequest:true
                },
            }
        },
        computed: {
            tableForm(){
                return [
                    {
                        label: '友链名称',
                        prop: 'name',
                        search:true
                    },
                    {
                        label: '友链LOGO',
                        prop: 'avatar',
                        type: 'upload',
                        ...this.uploadConfig,
                    },
                    {
                        label: '友链链接',
                        prop: 'link',
                    }
                ]
            }
        },
        components:{
            RowCol
        },
        async created() {

        },
        methods: {
            tabChange(tab){
                if(tab.name!==this.currentModel){
                    this.currentModel=tab.name
                    this.sendData.page=0
                    this.getTableList()
                }
            },
            rowUpdateApi(data){
                data.oldname=this.oldSendFormData.name
                return new Friend(this.currentModel).put(data)
            },
            rowSaveApi(data){
                return new Friend(this.currentModel).post(data)
            },
            rowDeleteApi(id,data){
                return new Friend(this.currentModel).delete(id,data)
            },
            tableGetApi(data){
                return new Friend(this.currentModel).get(data)
            },
        }
    }
</script>
<style lang="scss">

</style>

