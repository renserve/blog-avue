<template>
    <div class="user">
        <basic-container>
            <row-col>
                <template #left>
                    <model-tab :currentModel="currentModel" @tab-click="tabChange"></model-tab>
                </template>
                <template #right>
                    <el-card class="filterWrap"
                             :body-style="{ padding: '12px 20px',minHeight:'260px' }"
                             v-loading="searchLoading">
                        <template v-if="searchList">
                            <dl class="item" v-for="(i,index) in searchList">
                                <dt>{{i.label}}：</dt>
                                <dd v-for="x in i.dicData" :class="{active:i.value===x[i.props.value]}" @click="classifyChange(index,x[i.props.value])">
                                    {{x[i.props.label]}}
                                </dd>
                            </dl>
                        </template>
                    </el-card>
                    <public-crud :sendFormData="sendFormData" :pageInfo="pageInfo"
                                 :tableLoading="tableLoading" :tableData="tableData"
                                 :tableOptions="tableOptions">
                        <template #like="scope">
                            <span @click="rowTagClick(scope.row.id)" class="row_tag_blue row_tag_btn">{{scope.row.like}}</span>
                        </template>
                        <template #articleTypeForm>
                            <el-radio-group :value="sendFormData.articleType" @input="changeGroup($event)">
                                <el-radio-button v-for="i in tabColumn[0].dicData" :label="i.value">{{i.label}}</el-radio-button>
                            </el-radio-group>
                        </template>
                        <template #categoryIdForm="scope">
                            <el-checkbox-group v-if="sendFormData.categoryId" class="categoryIdWrapper" :value="sendFormData.categoryId"
                                               @input="changeCategory">
                                <el-checkbox :key="i.id" :label="i.id" v-for="i in categoryList">{{i.name}}</el-checkbox>
                            </el-checkbox-group>
                        </template>
                        <template #comment="scope">
                            <span @click="getCommentList(scope.row.id,scope.row.title)" class="row_tag_btn row_tag_blue">{{scope.row.comments.length}}</span>
                        </template>
                        <template #expand="scope">
                            <div class="expandForm">
                                <public-form>
                                    <template #comment="scope">
                                        <span @click="getCommentList(sendFormData.id,sendFormData.title)" class="row_tag_btn row_tag_blue">{{sendFormData.comments.length}}</span>
                                    </template>
                                </public-form>
                            </div>
                        </template>
                    </public-crud>
                </template>
            </row-col>
            <public-dialog width="80%" top="10vh" :title="`${baseDialogConfig.dialogTitle}文章评论列表`" :visible.sync="baseDialogConfig.tableDialogVisiable">
                <public-crud :sendFormData="dialogConfig.sendFormData" :pageInfo="dialogConfig.pageInfo"
                             :tableLoading="dialogConfig.tableLoading" :tableData="dialogConfig.tableData"
                             :tableOptions="dialogConfig.tableOptions">
                    <template #title>
                        <span>{{baseDialogConfig.dialogTitle}}</span>
                    </template>
                    <template #menu="scope">
                        <el-button type="text" class="el-icon-close" @click="deleteAndBlack(scope.row)" :size="avueConfig.size"> 拉黑</el-button>
                    </template>
                    <template #like="scope">
                        <span @click="rowTagClick(scope.row.id)" class="row_tag_blue row_tag_btn">{{scope.row.like}}</span>
                    </template>
                </public-crud>
            </public-dialog>
        </basic-container>
    </div>
</template>

<script>
import PublicDialog from '@/components/public-dialog'
import {User} from '@/api/cms/super'
import {Category} from '@/api/cms/category'
import {Article} from '@/api/article/article'
import {Comment} from '@/api/cms/message'
import {Blacklist} from '@/api/cms/blacklist'
import {Tag} from '@/api/cms/tag'
import RowCol from '@/components/row-col'
import tableMixin from '@/mixins/table'
import uniqBy from 'lodash/uniqBy'
import flatten from 'lodash/flatten'
import formMixin from '@/mixins/form'
const publicDic=[
    {label:'公开',value:0},
    {label:'私密',value:1}
]
const starDic=[
    {label:'非精选',value:0},
    {label:'精选',value:1},
]
export default {
    mixins:[tableMixin,formMixin],
    name: 'SysUser',
    components:{
        RowCol,
        PublicDialog
    },
    data(){
        return {
            formConfig:{
                menuBtn:false,
                disabled:true
            },
            searchLoading:false,
            currentModel:undefined,
            categoryOptions:undefined,
            categoryList:undefined,
            tagList:undefined,
            searchList:undefined,
            originTagList:undefined,
            authorList:undefined,
            tableConfig:{
                tabs:true,
                expand: true,
                expandRowKeys:[],
                rowKey:'id',
                menuWidth:150,
                isDelayRequest:true
            },
            baseDialogConfig:{
                tableDialogVisiable:false,
                dialogTitle:'',
                sendFormData:{},
                tableConfig:{
                    rowKey:'id',
                    addBtn:false
                },
                tableLoading:false,
                tableData:[],
                tableForm:[
                    {
                        label: '昵称',
                        prop: 'nickname',
                        display:false
                    },
                    {
                        label: '邮箱',
                        prop: 'email',
                        display:false
                    },
                    {
                        label: '点赞',
                        prop: 'like',
                        slot:true,
                        display:false
                    },
                    {
                        label: '内容',
                        prop: 'content',
                        $type:'editor_3',
                        formslot:true
                    },
                    {
                        label: '回复',
                        prop: 'reply',
                        $type:'editor_3',
                        formslot:true
                    },
                    {
                        label: '时间',
                        format:'yyyy-MM-dd HH:mm:ss',
                        valueFormat:'yyyy-MM-dd HH:mm:ss',
                        type:'datetime',
                        prop: 'create_time',
                        display:false,
                        width:90,
                    }
                ],
                sendData:{
                    page:0,
                    count:10
                },
                pageInfo:{
                    current: 1,
                    total:0,
                    size: 10,
                }
            },
            tabColumn:[
                {
                    label: '文章格式',
                    prop: 'articleType',
                    formslot:true,
                    type: "radio",
                    button:true,
                    dicData:[
                        {
                            label:"普通文本",
                            value:0
                        },
                        {
                            label:"富文本",
                            value:1
                        },
                        {
                            label:"Markdown",
                            value:2
                        }
                    ],
                },{
                    label: '内容',
                    $type:'editor_0',
                    prop: 'content',
                    formslot:true
                }
            ]
        }
    },
    computed: {
        formColumn(){
            const column=[
                {
                    label: '分类',
                    prop: 'categoryId',
                    type:'checkbox',
                    props:{
                        label:'name',
                        value:'id'
                    },
                    dicData:this.categoryList,
                    span:12
                },
                {
                    label: '浏览次数',
                    prop: 'views',
                    type:'number',
                    span:12
                },
                {
                    label: '标签',
                    prop: 'tagId',
                    type:'checkbox',
                    props:{
                        label:'name',
                        value:'id'
                    },
                    dicData:this.originTagList,
                    span:12
                },
                {
                    label: '点赞',
                    prop: 'like',
                    type:'number',
                    span:12
                },
                {
                    label: '作者',
                    prop: 'authorId',
                    type:'checkbox',
                    span:12,
                    props:{
                        label:"nickname",
                        value:"id"
                    },
                    dicData:this.authorList
                },
                {
                    label: '打赏',
                    prop: 'reward',
                    type:'number',
                    span:12
                },
                {
                    label: '收藏',
                    prop: 'collect',
                    type:'number',
                    span:12
                },
                {
                    label: '评论',
                    prop: 'comment',
                    type:'number',
                    formslot:true,
                    span:12
                },
                {
                    label: '封面',
                    prop: 'cover',
                    type: 'upload',
                    ...this.uploadConfig,
                    span:12
                },
                {
                    label: '描述',
                    prop: 'description',
                    type: 'textarea',
                    minRows:5,
                    span:12
                }
            ]
            return column
        },
        tableForm(){
            return [
                {
                    label: '标题',
                    prop: 'title',
                },
                {
                    label: '封面',
                    prop: 'cover',
                    span:12,
                    hide:true,
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
                    label: '描述',
                    prop: 'description',
                    type: 'textarea',
                    minRows:3,
                    hide:true,
                },
                {
                    label: '分类',
                    prop: 'categoryId',
                    formslot:true,
                    hide:true,
                    type:'checkbox',
                    props:{
                        label:'name',
                        value:'id'
                    },
                    dicData:this.categoryList
                },
                {
                    label: '标签',
                    hide:true,
                    prop: 'tagId',
                    type:'checkbox',
                    props:{
                        label:'name',
                        value:'id'
                    },
                    dicData:this.tagList
                },
                {
                    label: '作者',
                    prop: 'authorId',
                    type:'checkbox',
                    hide:true,
                    props:{
                        label:"nickname",
                        value:"id"
                    },
                    dicData:this.authorList
                },
                {
                    label: '浏览次数',
                    prop: 'views',
                    display:false
                },
                {
                    label: '点赞',
                    prop: 'like',
                    slot:true,
                    display:false
                },
                {
                    label: '评论',
                    prop: 'comment',
                    slot:true,
                    display:false
                },
                {
                    label: '发布时间',
                    prop: 'create_time',
                    format:'yyyy-MM-dd HH:mm:ss',
                    valueFormat:'yyyy-MM-dd HH:mm:ss',
                    type:'datetime',
                    width:90,
                },
                {
                    label: '状态',
                    prop: 'public',
                    slot:true,
                    type: "radio",
                    $type: "status",
                    button: true,
                    props:{
                        label:"label",
                        value:'value'
                    },
                    dicData:publicDic
                },
                {
                    label: '精选',
                    prop: 'star',
                    slot:true,
                    type: "radio",
                    $type: "status-reverse",
                    button: true,
                    props:{
                        label:"label",
                        value:'value'
                    },
                    dicData:starDic
                },
                {
                    label: '操作人',
                    prop: 'operateId',
                    type:'radio',
                    display:false,
                    hide:true,
                    props:{
                        label:"nickname",
                        value:"id"
                    },
                    dicData:this.authorList
                }
            ]
        },
        formGroup(){
            return [
                {
                    label: '文章基本信息',
                    prop: 'baseInfoGroup',
                    column:this.tableForm.filter(item=>{
                        if(!this.userInfo.groupIds.includes(1)){
                            return item.prop!=='authorId'
                        }else {
                            return true
                        }
                    })
                },
                {
                    label: '文章内容',
                    prop: 'contentInfoGroup',
                    column:this.tabColumn
                }
            ]
        },
    },
    async created() {
        this.searchLoading=true
    },
    methods: {
        changeCategory(e){
            if(e){
                const dicData=flatten(e.map(v=>{
                    const category=this.categoryList.find(i=>i.id===v)
                    return category.tags
                }))
                if(dicData.length){
                    this.tagList=uniqBy(dicData,'id').concat(this.onlyTagList)
                }else {
                    this.tagList=this.originTagList
                }
            }else {
                this.tagList=this.originTagList
            }
            this.sendFormData.categoryId=e
        },
        getCommentList(id,title){
            this.baseDialogConfig.dialogTitle=title
            this.baseDialogConfig.sendData.classId=id
            this.baseDialogConfig.tableDialogVisiable=true
            this.getTableList()
        },
        beforeWillOpen(){
            if(!this.userInfo.nickname){
                this.$message.error('请先设置昵称（文章作者）')
                throw 'error'
            }
            this.changeGroup(this.sendFormData.articleType || 0)
            this.changeCategory(this.sendFormData.categoryId)
        },
        changeGroup(e){
            this.sendFormData.articleType=e
            this.tabColumn[1].$type=`editor_${this.sendFormData.articleType}`
        },
        initSearchList(){
            this.searchList=[
                {
                    label:'分类',
                    searchKey:'categoryId',
                    props:{
                        label:'name',
                        value:'id'
                    },
                    value:undefined,
                    dicData:this.categoryList
                },
                {
                    label:'标签',
                    searchKey:'tagId',
                    props:{
                        label:'name',
                        value:'id'
                    },
                    value:undefined,
                    dicData:this.tagList

                },
                {
                    label:'作者',
                    searchKey:'authorId',
                    props:{
                        label:'username',
                        value:'id'
                    },
                    value:undefined,
                    dicData:this.authorList
                },
                {
                    label:'状态',
                    searchKey:'public',
                    props:{
                        label:'label',
                        value:'value'
                    },
                    value:undefined,
                    dicData:publicDic
                },
                {
                    label:'精选',
                    searchKey:'star',
                    props:{
                        label:'label',
                        value:'value'
                    },
                    value:undefined,
                    dicData:starDic
                }
            ].filter(item=>{
                if(this.userInfo.isLock){
                    return item.searchKey!=='authorId'
                }else {
                    return true
                }
            }).map(item=>{
                if(!item.dicData[0] || !item.dicData[0].isDefault){
                    item.dicData=JSON.parse(JSON.stringify(item.dicData))
                    let addItem={value:undefined};
                    addItem[item.props.label]='全部'
                    addItem.isDefault=1
                    item.dicData.unshift(addItem)
                }
                return item
            })
        },
        classifyChange(index,value){
            this.searchList[index].value=value
            if(!index){
                //重置标签
                if(value){
                    const dicData=this.searchList[0].dicData
                    this.tagList=dicData.find(i=>i.id===value).tags
                    this.searchList[1].dicData=[{isDefault: 1,
                        name: "全部",
                        value:undefined}].concat(this.tagList)
                }else {
                    this.tagList=this.originTagList
                    this.searchList[1].dicData=[{isDefault: 1,
                        name: "全部",
                        value:undefined}].concat(this.originTagList)
                }
                this.searchList[1].value=undefined
            }
            const searchParams={};
            this.searchList.map(item=>{
                searchParams[item.searchKey]=item.value
            })
            Object.assign(this.sendData,searchParams)
            this.getTableList()
        },
        async tabChange(tab){
            console.log(tab)
            if(tab.name!==this.currentModel){
                this.currentModel=tab.name
                this.sendData.page=0
                !this.categoryOptions && (this.categoryOptions=await new Category().get())
                if(this.userInfo.groupIds.includes(1) && !this.authorList){
                    this.authorList=await new User(tab.name).get()
                }
                !this.originTagList && (this.originTagList=await new Tag(tab.name).get())
                this.onlyTagList=this.originTagList.filter(i=>!i.categories.length)
                this.categoryList=this.categoryOptions
                this.tagList=JSON.parse(JSON.stringify(this.originTagList))
                !this.searchList && this.initSearchList()
                this.searchLoading && (this.searchLoading=false)
                this.getTableList()
                this.initFormData={
                    articleType:0,
                    categoryId:[],
                    public:0,
                    star:0,
                    status:0,
                    authorId:[this.userInfo.id],
                    modelId:this.currentModel
                }
            }
        },
        deleteAndBlack(form){
            this.rowTagClick({...form,$sign:1},true,`拉黑邮箱为${form.email}的用户`)
        },
        rowTagApi(data){
            if(data.$sign){
                delete data.$sign
                return new Blacklist(data.model).postAndDeleteComment(data)
            }else {
                return this.baseDialogConfig.tableDialogVisiable?new Comment(this.currentModel).like(data):new Article(this.currentModel).like(data)
            }
        },
        rowUpdateApi(data){
            return this.baseDialogConfig.tableDialogVisiable?new Comment(this.currentModel).put(data):new Article(this.currentModel).put(data)
        },
        rowSaveApi(data){
            return new Article(this.currentModel).post(data)
        },
        rowDeleteApi(id,data){
            return this.baseDialogConfig.tableDialogVisiable?new Comment(this.currentModel).delete(id,data):new Article(this.currentModel).delete(id,data)
        },
        tableGetApi(data){
            return this.baseDialogConfig.tableDialogVisiable?new Comment(this.currentModel).get(data):new Article(this.currentModel).get(this.userInfo.isLock?{authorId:this.userInfo.id,...data}:data)
        },
    }
}
</script>
<style lang="scss" scoped>
.categoryIdWrapper {
    >>> .el-checkbox {
        margin-right: 10px!important;
    }
}

.expandForm {
    .row_tag_blue {
        padding: 0 15px;
    }
    >>> .el-upload {
        border: none;
    }
    >>> i {
        display: none;
    }
    >>> .el-checkbox {
        display: none;
        &.is-checked {
            display: block;
        }
        .el-checkbox__label {
            color: #606266!important;
        }
        .el-checkbox__input {
            display: none;
        }
    }
    >>> input ,>>> textarea{
        text-align: left;
        background-color: #fff!important;
        color: #606266!important;
        border: none;
    }
}
.filterWrap {
    margin-bottom: 20px;
    >>> dl.item {
        display: flex;
        align-items: center;
        font-size: 14px;
        margin: 0;
        padding: 10px 0;
        border-bottom: 1px dashed #e2e4ea;
        flex-wrap: wrap;
        &:last-child {
            border: none;
        }
        dt {
            margin-right: 15px;
        }
        dd {
            flex: 0 1 auto;
            cursor: pointer;
            margin-left: 0;
            margin-right: 15px;
            padding: 5px 8px;
            border-radius: 5px;
            &.active {
                background-color: #2b303b;
                color: #ffffff;
            }
        }
    }
}
</style>

