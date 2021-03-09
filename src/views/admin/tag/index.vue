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
    import {mapGetters} from 'vuex'
    import RowCol from '@/components/row-col'
    import {Tag} from '@/api/cms/tag'
    import {Category} from '@/api/cms/category'
    import {Model,Group} from '@/api/cms/super'
    import tableMixin from '@/mixins/table'
    export default {
        mixins:[tableMixin],
        name: 'SysUser',
        data(){
            return {
                groupOptions:[],
                dicData:[],
                currentModel:undefined,
                tableConfig:{
                    isDelayRequest:true
                },
                initFormData:{
                    sort:0
                }
            }
        },
        computed: {
            ...mapGetters([
                'usersList'
            ]),
           tableForm(){
                return [
                    {
                        label: '标签',
                        prop: 'name',
                        search:true
                    },
                    {
                        label: '上级分类',
                        prop: 'categories',
                        type:'checkbox',
                        dicData:this.dicData,
                        props:{
                            label:"name",
                            value:"id"
                        }
                    },
                    {
                        label: '排序',
                        hide:true,
                        prop: 'sort'
                    },
                    {
                        label: '操作人',
                        prop: 'operateId',
                        type:'radio',
                        display:false,
                        props:{
                            label:"nickname",
                            value:"id"
                        },
                        dicData:this.usersList
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
            tableGetCallBack(data){
                data.map(item=>{
                    item.categories=item.categories.map(i=>i.id)
                })
            },
            async tabChange(tab){
                if(tab.name!==this.currentModel){
                    this.currentModel=tab.name
                    this.dicData=await new Category('article').get({forbid:1})
                    this.sendData.page=0
                    this.getTableList()
                }
            },
            rowUpdateApi(data){
                return new Tag(this.currentModel).put(data)
            },
            rowSaveApi(data){
                return new Tag(this.currentModel).post(data)
            },
            rowDeleteApi(id,data){
                return new Tag(this.currentModel).delete(id,data)
            },
            tableGetApi(data){
                return new Tag(this.currentModel).get(data)
            },
        }
    }
</script>
<style lang="scss">

</style>

