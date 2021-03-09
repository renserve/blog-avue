<template>
    <basic-container>
        <div class="handleContainer mbGap">
            <model-tab v-show="0" position="top" type="default" :currentModel="currentModel" @tab-click="tabChange"></model-tab>
            <el-button-group>
                <el-button
                    :type="formMethod==='post' && !sendFormData.parentId?'primary':''"
                    :size="avueConfig.size"
                    @click="handlerAddNew">新增
                </el-button>
                <el-button
                    :type="formMethod==='post' && sendFormData.parentId && !sendFormData.id?'primary':''"
                    :size="avueConfig.size"
                    @click="handlerAdd">添加
                </el-button>
                <el-button
                    :type="formMethod==='put'?'primary':''"
                    :size="avueConfig.size"
                    @click="handlerEdit">编辑
                </el-button>
                <el-button
                    :type="formMethod==='delete'?avueConfig.danger:''"
                    :size="avueConfig.size"
                    @click="handleDelete">删除
                </el-button>
            </el-button-group>
            <div>
                <el-button
                    type="primary"
                    :size="avueConfig.size"
                    @click="handleAddModel">
                    一键同步
                </el-button>
                <el-checkbox v-model="parentColumn.disabled"></el-checkbox>
            </div>
        </div>
        <el-row>
            <el-col
                :span="8"
                >
                <el-card shadow="never">
                    <el-input
                        clearable
                        :size="avueConfig.size"
                        placeholder="输入关键字进行过滤（多个ID逗号分隔）"
                        class="mbGap"
                        v-model.trim="filterText">
                    </el-input>
                    <el-scrollbar wrap-class="scrollbar-wrapper-dialog">
                        <el-tree
                            ref="menuTree"
                            :expand-on-click-node="false"
                            :data="treeOptions.treeData"
                            :props="treeOptions.defaultProps"
                            :filter-node-method="filterNode"
                            node-key="id"
                            @allow-drop="allowDrop"
                            @node-click="nodeClick"
                            highlight-current
                            :draggable="!userInfo.isLock"
                            :default-expanded-keys="originMenuData.filter(i=>(!i.parentId && !i.meta.hasButton)).map(i=>i.id)"
                        />
                    </el-scrollbar>
                </el-card>
            </el-col>
            <el-col
                :span="16"
                >
                <el-card shadow="never">
                    <public-form ref="publicForm"></public-form>
                </el-card>
            </el-col>
        </el-row>
    </basic-container>
</template>

<script>
    import modelTab from '@/components/model-tab'
    import {mapGetters} from "vuex";
    import {Model} from '@/api/cms/super'
    import {Menu} from '@/api/cms/menu'
    import formMixin from '@/mixins/form'
    import {recursionMenu} from '@/util/util'
    import isNull from 'lodash/isNull'
    import omitBy from 'lodash/omitBy'
    import isUndefined from 'lodash/isUndefined'
    import flattenDeep from 'lodash/flattenDeep'
    export default {
        mixins:[formMixin],
        components:{
            modelTab
        },
        watch: {
            filterText(val) {
                this.$refs.menuTree.filter(val);
            }
        },
        data() {
            return {
                sendFormData:{
                    type:'left',
                    parentId:0
                },
                treeOptions:{
                    treeData:[],
                    checkedKeys: [],
                    defaultProps: {
                        label: 'title',
                        value: 'id'
                    },
                },
                originMenuData:[],
                currentModel:undefined,
                filterText:undefined,
                formMethod: 'post',
                parentColumn:{
                    label: "父级节点",
                    prop: "parentId",
                    type:'number',
                    disabled:true
                }
            };
        },
        async created() {
            this.allSelectModel=this.modelOptions.map(v=>v.id)
        },
        computed: {
            formColumn(){
                const type=this.sendFormData.type || 'top,left'
                return [
                    this.parentColumn,
                    {
                        label: "标题",
                        prop: "title",
                        $type:'top,left'
                    },
                    {
                        label: "路由地址",
                        prop: "path",
                        $type:'top,left'
                    },
                    {
                        label: "按钮名称",
                        prop: "title",
                        $type:'button'
                    },
                    {
                        label: "请求路径",
                        prop: "path",
                        $type:'button'
                    },
                    {
                        label: "模块类型",
                        prop: "menumodel",
                        type:'checkbox',
                        props:{
                            label:"name",
                            value:"id"
                        },
                        dicData:this.modelOptions
                    },
                    {
                        label: "菜单类型",
                        prop: "type",
                        type:'radio',
                        button:true,
                        dicData:[
                            /*{
                                label:"顶部菜单",
                                value:"top"
                            },*/
                            {
                                label:"左侧菜单",
                                value:"left"
                            },
                            {
                                label:"按钮",
                                value:"button"
                            }
                        ]
                    },
                    {
                        label: "请求方式",
                        prop: "method",
                        type:'radio',
                        button:true,
                        dicData:[
                            {
                                label:"GET",
                                value:"get"
                            },
                            {
                                label:"POST",
                                value:"post"
                            },
                            {
                                label:"PUT",
                                value:"put"
                            },
                            {
                                label:"DELETE",
                                value:"delete"
                            }
                        ],
                        $type:'button'
                    },
                    {
                        label: "图标",
                        prop: "icon",
                        $type:'top,left'
                    },
                    {
                        label: "权限标识",
                        prop: "permissionCode"
                    },
                    {
                        label: "排序",
                        type:'number',
                        prop: "sort"
                    }
                ].filter(i=>(!i.$type || i.$type.includes(type)))
            },
            ...mapGetters(["permissions",'avueConfig']),
        },
        methods: {
            handleAddModel(){
                if(!this.sendFormData.id){
                    this.$message.warning('请选择菜单')
                }else {
                    this.formMethod = 'put'
                }
                const isButton=this.sendFormData.children.some(item=>item.type==='button')
                if(!isButton){
                    this.$message.warning('请选择菜单类型为按钮的直属上级菜单')
                    return
                }
                this.$alert(...this.confirmHtmlWrap(`该菜单下的子菜单添加全部模块类型`)).then(_=> {
                    this.sendFormData.children.map(async item=>{
                        if(item.type==='button'){
                            item.menumodel=this.allSelectModel
                            await this.formSave(item)
                        }
                    })
                }).catch(_=>{})
            },
            allowDrop(){
                return false
            },
            rowSaveApi(data){
                return new Menu(this.currentModel)[this.formMethod]({...data,oldData:data})
            },
            async rowSaveCallback(form){
                const hasButton=this.sendFormData.children
                if(this.formMethod!=='post' && form.type!=='button' && form.permissionCode && !hasButton){
                    const oldMethod=this.formMethod
                    this.formMethod='post'
                    let methods={_add:'post',_edit:'put',_del:'delete'}
                    let titles={_add:'添加操作',_edit:'修改操作',_del:'删除操作'}
                    await Promise.all(['_add','_edit','_del'].map(async k=>{
                        const code=form.permissionCode+k
                        const item={
                            menumodel:form.menumodel,
                            parentId:form.id,
                            path:code,
                            method:methods[k],
                            title:titles[k],
                            type:'button',
                            permissionCode:code
                        }
                        await this.rowSaveApi(item)
                    }))
                    this.formMethod=oldMethod
                }
                await this.onLoadTree()
                if(this.sendFormData.id){
                    this.$refs.menuTree.setCurrentKey(this.sendFormData.id)
                }
            },
            async onLoadTree() {
                await new Menu(this.currentModel).get().then(data=>{
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
                    this.treeOptions.treeData=recursionMenu(parent,children)
                    this.originMenuData=data
                })
            },
            tabChange(tab){
                if(tab.name!==this.currentModel){
                    this.sendFormData.menumodel=[tab.name]
                    this.currentModel=tab.name
                    this.handlerAddNew()
                    this.onLoadTree()
                }
            },
            filterNode(value, data) {
                if (!value) return true
                if(/,/.test(value)){
                    const ids=value.split(',').map(Number)
                    return ids.includes(data.id)
                }else {
                    return data.title.includes(value)
                }
            },
            nodeClick(data){
                if(data.children && !data.children.length){
                    delete data.children
                }
                Object.keys(data).map(k=>{
                    isNull(data[k]) && (data[k]='')
                })
                this.sendFormData=data
                this.formMethod = 'put'
                // this.sendFormData=omitBy(this.sendFormData,isNull);
            },
            handlerAddNew(){
                //取消高亮
                this.$nextTick(()=>{
                    this.$refs.menuTree.setCurrentKey(null)
                    this.resetForm()
                    this.formMethod = 'post'
                    console.log(this.sendFormData,'==')
                })
            },
            handlerAdd(){
                if(!this.sendFormData.id){
                    this.$message.warning('请选择菜单')
                }else {
                    this.resetForm(this.sendFormData.id)
                    this.formMethod = 'post'
                }

            },
            handlerEdit(){
                if(this.formMethod==='post' && this.sendFormData.parentId){
                    const id=this.sendFormData.parentId
                    const sendFormData=this.originMenuData.filter(i=>i.id===id)[0]
                    this.sendFormData=omitBy(sendFormData,isNull)
                }
                if(!this.sendFormData.id){
                    this.$message.warning('请选择菜单')
                }else {
                    this.formMethod = 'put'
                }
            },
            handleDelete(){
                if(this.formMethod==='post' && this.sendFormData.parentId){
                    const id=this.sendFormData.parentId
                    const sendFormData=this.originMenuData.filter(i=>i.id===id)[0]
                    this.sendFormData=sendFormData
                }
                if(!this.sendFormData.id){
                    this.$message.warning('请选择菜单')
                }else {
                    this.formMethod='delete'
                    this.$confirm("确认删除所选菜单?", {
                        confirmButtonText: "确认",
                        cancelButtonText: "取消",
                        type: "warning"
                    }).then(() => {
                        console.log(this.formMethod)
                        return new Menu()[this.formMethod](this.sendFormData.id,{...this.sendFormData,oldData:this.sendFormData});
                    }).then(() => {
                        this.resetForm()
                        this.$message.success("删除成功");
                        this.onLoadTree()
                    }).catch(_=>{});
                }
            },
            resetForm(id){
                this.$refs.publicForm.$refs.avueForm.resetForm()
                this.$nextTick(()=>{
                    this.sendFormData={
                        parentId:id || 0,
                        type:'left',
                        menumodel:[this.currentModel],
                    }
                })
            },
        }
    };
</script>

<style lang="scss" scoped>
    .handleContainer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .el-tabs {
            flex: 1;
            margin-right: 50px;
        }
        .el-checkbox {
            margin-left: 30px;
        }
    }
    .mbGap {
        margin-bottom: 15px;
    }
</style>
