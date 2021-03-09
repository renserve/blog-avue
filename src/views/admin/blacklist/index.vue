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
                    </public-crud>
                </template>
            </row-col>
        </basic-container>
    </div>
</template>

<script>
    import RowCol from '@/components/row-col'
    import {Blacklist} from '@/api/cms/blacklist'
    import {Model,Group} from '@/api/cms/super'
    import tableMixin from '@/mixins/table'
    import {User} from '@/api/cms/super'
    import {mapGetters} from 'vuex'
    export default {
        mixins:[tableMixin],
        name: 'SysUser',
        data(){
            return {
                authorList:[],
                groupOptions:[],
                currentModel:undefined,
                tableConfig:{
                    editBtn:false,
                    isDelayRequest:true
                },
            }
        },
        computed: {
            ...mapGetters([
                'currentMenuModelId'
            ]),
            tableForm(){
                return [
                    {
                        label: '用户昵称',
                        prop: 'nickname',
                    },
                    {
                        label: '头像',
                        prop: 'avatar',
                        type: 'upload',
                        ...this.uploadConfig,
                    },
                    {
                        label: '邮箱',
                        prop: 'email',
                        search:true
                    },
                    {
                        label: 'IP地址',
                        prop: 'ip',
                        slot:true,
                        disabled:true
                    },
                    {
                        label: '备注',
                        prop: 'remark',
                        hide:true
                    },
                    {
                        label: '时间',
                        width:90,
                        prop: 'create_time',
                        format:'yyyy-MM-dd HH:mm:ss',
                        valueFormat:'yyyy-MM-dd HH:mm:ss',
                        type:'datetime',
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
            tabChange(tab){
                if(tab.name!==this.currentModel){
                    this.currentModel=tab.name
                    this.sendData.page=0
                    this.getTableList()
                }
            },
            rowUpdateApi(data){
                return new Blacklist(this.currentModel).put(data)
            },
            rowSaveApi(data){
                return new Blacklist(this.currentModel).post(data)
            },
            rowDeleteApi(id,data){
                return new Blacklist(this.currentModel).delete(id,data)
            },
            tableGetApi(data){
                return new Blacklist(this.currentModel).get(data)
            },
        }
    }
</script>
<style lang="scss">

</style>

