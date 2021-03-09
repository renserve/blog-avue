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
    import {Idea} from '@/api/cms/idea'
    import tableMixin from '@/mixins/table'
    import {User} from "@/api/cms/super";
    export default {
        mixins:[tableMixin],
        name: 'SysUser',
        data(){
            return {
                initFormData:{
                    status:true
                },
                authorList:[],
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
                        label: '字符',
                        prop: 'name',
                        search:true
                    },
                    {
                        label: '状态',
                        prop: 'status',
                        slot:true,
                        type: "radio",
                        $type: "status",
                        button: true,
                        dataType:'boolean',
                        dicData:[
                            {label:'显示',value:true},
                            {label:'隐藏',value:false},
                        ]
                    },
                    {
                        label: '权重',
                        prop: 'value',
                        type:'number'
                    },
                    {
                        label: '作者',
                        searchFilterable:true,
                        prop: 'authorId',
                        type:'select',
                        search:this.userInfo.isLock?false:true,
                        searchValue:this.userInfo.id,
                        display:false,
                        props:{
                            label:"nickname",
                            value:"id"
                        },
                        dicData:this.authorList
                    },
                ]
            },
        },
        components:{
            RowCol
        },
        async created() {
            this.searchSendData.authorId=this.userInfo.id
            this.authorList=await new User().get()
        },
        methods: {
            beforeSendFormData(data){
                !data.status && (data.status='false')
            },
            tabChange(tab){
                if(tab.name!==this.currentModel){
                    this.currentModel=tab.name
                    this.sendData.page=0
                    this.getTableList()
                }
            },
            rowUpdateApi(data){
                return new Idea().put(data)
            },
            rowSaveApi(data){
                return new Idea().post(data)
            },
            rowDeleteApi(id,data){
                return new Idea().delete(id,data)
            },
            tableGetApi(data){
                return new Idea().get(data)
            },
        }
    }
</script>
<style lang="scss">

</style>

