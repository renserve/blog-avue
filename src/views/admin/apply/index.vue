<template>
    <div class="user">
        <basic-container>
            <row-col>
                <template #left>
                    <model-tab :currentModel="currentModel" @tab-click="tabChange"></model-tab>
                </template>
                <template #right>
                    <public-crud>
                        <!--<template #update_time="scope">
                            <span v-if="scope.row.operateId">{{scope.row.update_time}}</span>
                        </template>-->
                        <template #ip="scope">
                            {{scope.row.ip}}
                            <br/>
                            {{scope.row.area}}
                        </template>
                        <template #menuLeft>
                            <el-button type="primary" @click="batchSubmit('批量通过入驻申请')" :size="avueConfig.size"> 批量通过</el-button>
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
    import {Apply} from '@/api/cms/apply'
    import {Model,Group} from '@/api/cms/super'
    import tableMixin from '@/mixins/table'
    import {Blacklist} from '@/api/cms/blacklist'
    import {mapGetters} from 'vuex'
    import {User} from '@/api/cms/super'
    export default {
        mixins:[tableMixin],
        name: 'SysUser',
        data(){
            return {
                groupOptions:[],
                currentModel:undefined,
                authorList:[],
                tableConfig:{
                    selection:true,
                    isDelayRequest:true,
                    addBtn:false,
                },
            }
        },
        computed: {
            ...mapGetters(['currentMenuModelId']),
            tableForm(){
                return [
                    {
                        label: '用户名',
                        prop: 'nickname',
                        disabled:true,
                    },
                    {
                        label: '邮箱',
                        prop: 'email',
                        disabled:true,
                    },
                    {
                        label: 'IP地址',
                        prop: 'ip',
                        slot:true,
                        disabled:true
                    },
                    {
                        label: '入驻信息',
                        prop: 'content',
                        type: 'textarea',
                        disabled:true,
                        minRows: 2
                    },
                    {
                        label: '回复内容',
                        prop: 'reply',
                        search:true,
                        formslot:true,
                        $type:'editor_2'
                    },
                    {
                        label: '申请时间',
                        width:90,
                        prop: 'create_time',
                    },
                    {
                        label: '操作时间',
                        width:90,
                        prop: 'update_time'
                    },
                    {
                        label: '操作人',
                        width:90,
                        prop: 'operateId',
                        type:'select',
                        props:{
                            label:"nickname",
                            value:"id"
                        },
                        dicData:this.authorList
                    }
                ]
            }
        },
        components:{
            RowCol
        },
        async created() {
            this.authorList=await new User(this.currentMenuModelId).get()
        },
        methods: {
            batchSubmitApi(data){
                return new Apply(this.currentModel).passApply(data)
            },
            deleteAndBlack(form){
                //添加备注和来源ID
                form.remark=form.content
                form.classId=form.id
                this.rowTagClick({...form,$sign:1},true,`拉黑邮箱为${form.email}的用户`)
            },
            rowTagApi(data){
                return new Blacklist(data.model).postAndDeleteApply(data)
            },
            tabChange(tab){
                if(tab.name!==this.currentModel){
                    this.currentModel=tab.name
                    this.sendData.page=0
                    this.getTableList()
                }
            },
            rowUpdateApi(data){
                return new Apply(this.currentModel).put(data)
            },
            rowSaveApi(data){
                return new Apply(this.currentModel).post(data)
            },
            rowDeleteApi(id,data){
                return new Apply(this.currentModel).delete(id,data)
            },
            tableGetApi(data){
                return new Apply(this.currentModel).get(data)
            },
        }
    }
</script>
<style lang="scss">

</style>

