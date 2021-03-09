<template>
    <div class="user">
        <basic-container>
            <row-col>
                <template #left>
                    <model-tab :currentModel="currentModel" @tab-click="tabChange"></model-tab>
                </template>
                <template #right>
                    <public-crud>
                        <template #ip="scope">
                            {{scope.row.ip}}
                            <br/>
                            {{scope.row.area}}
                        </template>
                        <template #menu="scope">
                            <el-button type="text" class="el-icon-close" @click="deleteAndBlack(scope.row)" :size="avueConfig.size"> 拉黑</el-button>
                        </template>
                    </public-crud>
                </template>
            </row-col>
        </basic-container>
    </div>
</template>

<script>
    import RowCol from '@/components/row-col'
    import {Message} from '@/api/cms/message'
    import {Model,Group} from '@/api/cms/super'
    import tableMixin from '@/mixins/table'
    import {Blacklist} from '@/api/cms/blacklist'
    import {mapGetters} from 'vuex'
    export default {
        mixins:[tableMixin],
        name: 'SysUser',
        data(){
            return {
                groupOptions:[],
                currentModel:undefined,
                tableConfig:{
                    addBtn:false,
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
                        label: '用户名',
                        prop: 'nickname',
                        disabled:true
                    },
                    {
                        label: '邮箱',
                        prop: 'email',
                        disabled:true
                    },
                    {
                        label: 'IP地址',
                        prop: 'ip',
                        slot:true,
                        disabled:true
                    },
                    {
                        label: '留言内容',
                        prop: 'content',
                        disabled:true,
                        $type:'editor_3',
                        formslot:true
                    },
                    {
                        label: '回复内容',
                        prop: 'reply',
                        formslot:true,
                        $type:'editor_2'
                    },
                    {
                        label: '留言时间',
                        display:false,
                        prop: 'create_time',
                    },
                    {
                        label: '回复时间',
                        display:false,
                        prop: 'update_time',
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
            console.log(this.usersList,'this.usersList')
        },
        methods: {
            deleteAndBlack(form){
                form.classId=form.id
                form.remark=form.content
                this.rowTagClick({...form,$sign:1},true,`拉黑邮箱为${form.email}的用户`)
            },
            rowTagApi(data){
                return new Blacklist(data.model).postAndDeleteMessage(data)
            },
            tabChange(tab){
                if(tab.name!==this.currentModel){
                    this.currentModel=tab.name
                    this.sendData.page=0
                    this.getTableList()
                }
            },
            rowUpdateApi(data){
                return new Message(this.currentModel).put(data)
            },
            rowSaveApi(data){
                return new Message(this.currentModel).post(data)
            },
            rowDeleteApi(id,data){
                return new Message(this.currentModel).delete(id,data)
            },
            tableGetApi(data){
                return new Message(this.currentModel).get(data)
            },
        }
    }
</script>
<style lang="scss">

</style>

