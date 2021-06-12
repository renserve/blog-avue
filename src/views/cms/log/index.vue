<template>
    <div class="user">
        <basic-container>
            <row-col>
                <template #left>
                    <model-tab :currentModel="currentModel" @tab-click="tabChange"></model-tab>
                </template>
                <template #right>
                    <public-crud>
                        <template #menuLeft>
                            <el-button v-if="userInfo.id===1" :type="avueConfig.danger" @click="batchSubmit('批量删除选中日志')" class="el-icon-delete" :size="avueConfig.size"> 批量删除</el-button>
                        </template>
                        <template #expand="scope">
                            <div class="expandForm">
                                {{JSON.parse(scope.row.content)}}
                            </div>
                        </template>
                    </public-crud>
                </template>
            </row-col>
        </basic-container>
    </div>

</template>

<script>
    import RowCol from '@/components/row-col'
    import {Log} from '@/api/cms/super'
    import tableMixin from '@/mixins/table'
    export default {
        mixins:[tableMixin],
        name: 'SysUser',
        data(){
            return {
                groupOptions:[],
                currentModel:undefined,
                tableConfig:{
                    indexFixed:false,
                    expandFixed:false,
                    selectionFixed:false,
                    expand: true,
                    expandRowKeys:[],
                    rowKey:'id',
                    selection:true,
                    addBtn:false,
                    isDelayRequest:true,
                    menu:false
                },
                tableForm:[
                    {
                        label: '日志内容',
                        prop: 'message',
                    },
                    {
                        label: '请求接口',
                        prop: 'path'
                    },
                    {
                        label: '请求方式',
                        prop: 'method'
                    },
                    {
                        label: '操作时间',
                        prop: 'create_time'
                    },
                ]
            }
        },
        computed: {

        },
        components:{
            RowCol
        },
        async created() {

        },
        methods: {
            batchSubmitApi(data){
                return new Log(this.currentModel).delLog(data)
            },
            tabChange(tab){
                console.log(tab.name)
                if(tab.name!==this.currentModel){
                    this.currentModel=tab.name
                    this.sendData.page=0
                    this.getTableList()
                }
            },
            tableGetApi(data){
                return new Log(this.currentModel).getLog(data)
            },
        }
    }
</script>
<style lang="scss">

</style>