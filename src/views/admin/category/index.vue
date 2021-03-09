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
    import {Category} from '@/api/cms/category'
    import {Model,Group} from '@/api/cms/super'
    import {Tag} from '@/api/cms/tag'
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
            }
        },
        computed: {
            ...mapGetters([
                'usersList'
            ]),
            tableForm(){
                return [
                    {
                        label: '分类',
                        prop: 'name',
                        search:true
                    },
                    {
                        label: '下级标签',
                        prop: 'tags',
                        type:'checkbox',
                        dicData:this.dicData,
                        props:{
                            label:"name",
                            value:"id"
                        },
                    },
                    {
                        label: '分类描述',
                        prop: 'description',
                    },
                    {
                        label: '分类封面',
                        prop: 'cover',
                        span:12,
                        type: 'upload',
                        ...this.uploadConfig,
                    },
                    {
                        label: '背景图',
                        prop: 'bgCover',
                        span:12,
                        hide:true,
                        type: 'upload',
                        ...this.uploadConfig,
                    },
                    {
                        label: '操作人',
                        prop: 'operateId',
                        display:false,
                        type:'radio',
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
                    item.tags=item.tags.map(i=>i.id)
                })
            },
            async tabChange(tab){
                if(tab.name!==this.currentModel){
                    this.currentModel=tab.name
                    this.dicData=await new Tag(this.currentModel).get({forbid:1})
                    this.sendData.page=0
                    this.getTableList()
                }
            },
            rowUpdateApi(data){
                return new Category(this.currentModel).put(data)
            },
            rowSaveApi(data){
                return new Category(this.currentModel).post(data)
            },
            rowDeleteApi(id,data){
                return new Category(this.currentModel).delete(id,data)
            },
            tableGetApi(data){
                return new Category(this.currentModel).get(data)
            },
        }
    }
</script>
<style lang="scss">

</style>

