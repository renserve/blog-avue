<template>
    <div class="user">
        <basic-container>
            <row-col>
                <template #left>
                    <model-tab :currentModel="currentModel" @tab-click="tabChange"></model-tab>
                </template>
                <template #right>
                    <public-crud>
                        <template #menu="scope">
                            <el-button
                                type="text"
                                size="mini"
                                icon="el-icon-plus"
                                @click="handleDialogPermission(scope.row,scope.index)">权限
                            </el-button>
                        </template>
                    </public-crud>
                </template>
            </row-col>
        </basic-container>
        <public-dialog :title="`分配${dialogOptions.name}权限`" :visible.sync="dialogOptions.dialogVisible">
            <div class="switchWrap">
                <span>菜单关联：</span>
                <el-radio-group size="mini" v-model="dialogOptions.isInitTree">
                    <el-radio-button :label="true">是</el-radio-button>
                    <el-radio-button :label="false">否</el-radio-button>
                </el-radio-group>
            </div>
            <el-tree
                v-if="dialogOptions.dialogVisible"
                ref="menuTree"
                :expand-on-click-node="false"
                show-checkbox
                :data="dialogOptions.treeData"
                :props="dialogOptions.defaultProps"
                :check-strictly="dialogOptions.isInitTree"
                :default-checked-keys="dialogOptions.checkedKeys"
                :filter-node-method="filterNode"
                node-key="id"
                @node-click="nodeClick"
                default-expand-all/>
            <div class="buttonGroup">
                <el-button @click="handleSubmitPermission" type="primary" class="el-icon-check" :size="avueConfig.size"> 保存</el-button>
                <el-button class="el-icon-circle-close" @click="dialogOptions.dialogVisible=false" :size="avueConfig.size"> 取消</el-button>
            </div>
        </public-dialog>
    </div>
</template>

<script>
    import RowCol from '@/components/row-col'
    import PublicDialog from '@/components/public-dialog'
    import {Model,Group} from '@/api/cms/super'
    import tableMixin from '@/mixins/table'
    import {Menu} from '@/api/cms/menu'
    import {recursionMenu} from '@/util/util'
    export default {
        mixins:[tableMixin],
        name: 'SysUser',
        data(){
            return {
                dialogOptions:{
                    name:undefined,
                    group_id:undefined,
                    menuIds:undefined,
                    authIds:undefined,
                    isInitTree:false,
                    dialogVisible:false,
                    fullscreen:false,
                    treeData:[],
                    checkedKeys: [],
                    defaultProps: {
                        label: 'title',
                        value: 'id'
                    }
                },
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
                        label: '分组名',
                        prop: 'name',
                    },
                    {
                        label: '分组描述',
                        prop: 'info',
                    }
                ]
            }
        },
        components:{
            RowCol,
            PublicDialog,
        },
        async created() {

        },
        methods: {
            onLoadTree() {
                new Menu(this.currentModel).get().then(data=>{
                    const parent=[],children=[];
                    data.map(item=>{
                        item.children=[]
                        item.meta={}
                        if(!item.parentId){
                            parent.push(item)
                        }else {
                            children.push(item)
                        }
                    })
                    this.dialogOptions.treeData=recursionMenu(parent,children)
                })
            },
            nodeClick(){

            },
            filterNode(){
                if (!value) return true
                return data.label.includes(value)
            },
            rowSaveCallBack(){
                this.dialogOptions.dialogVisible=false
            },
            handleSubmitPermission(){
                const checkedNode=this.$refs.menuTree.getCheckedNodes(false,true)
                const authIds=checkedNode.filter(i=>i.type==='button').map(i=>i.id)
                const menuIds=checkedNode.filter(i=>i.type!=='button').map(i=>i.id)
                this.rowSave({
                    id:this.dialogOptions.group_id,
                    name:this.dialogOptions.name,
                    oldData:this.dialogOptions.checkedKeys,
                    menuIds:menuIds,
                    authIds:authIds
                })
            },
            async handleDialogPermission(form,index){
                this.dialogOptions.group_id=form.id
                this.dialogOptions.name=form.name
                this.dialogOptions.isInitTree=true
                const checkedKeys=await new Menu().getPermission({groupId:String(form.id),model:this.currentModel})
                this.dialogOptions.checkedKeys=checkedKeys.map(i=>i.id)
                this.dialogOptions.dialogVisible=true
                this.$nextTick(()=>{
                    this.dialogOptions.isInitTree=false
                })
            },
            tabChange(tab){
                if(tab.name!==this.currentModel){
                    this.currentModel=tab.name
                    this.sendData.page=0
                    this.onLoadTree()
                    this.getTableList()
                }
            },
            rowUpdateApi(data){
                return new Group(this.currentModel).put(data)
            },
            rowSaveApi(data){
                return !this.dialogOptions.dialogVisible?new Group(this.currentModel).post(data):new Group().dispatch(data)
            },
            rowDeleteApi(id,data){
                return new Group(this.currentModel).delete(id,data)
            },
            tableGetApi(data){
                return new Group(this.currentModel).get(data)
            },
        }
    }
</script>
<style lang="scss" scoped>
    .switchWrap {
        margin: 0 auto 15px;
        text-align: center;
    }
    .buttonGroup {
        padding: 20px;
        text-align: center;
    }
</style>

