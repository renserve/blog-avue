<template>
    <div class="user">
        <basic-container>
            <public-crud>
                <template #menuLeft>
                    <el-button :type="avueConfig.danger" @click="batchSubmit('批量删除选中随笔')" class="el-icon-delete" :size="avueConfig.size"> 批量删除</el-button>
                </template>
                <template #categoryIdForm="scope">
                    <el-radio-group class="categoryIdWrapper" size="small" v-model="scope.row.categoryId">
                        <el-radio @click.native.prevent="cancelClick(i.id)" border :key="i.id" :label="i.id" v-for="i in categoryList">{{i.name}}</el-radio>
                    </el-radio-group>
                </template>
                <template #tagIdForm="scope">
                    <el-checkbox-group v-if="scope.row.tagId" class="categoryIdWrapper" size="small" :value="scope.row.tagId"
                                       @input="changeTag">
                        <el-checkbox :key="i.id" :label="i.id" v-for="i in tagList">{{i.name}}</el-checkbox>
                    </el-checkbox-group>
                </template>
            </public-crud>
        </basic-container>
    </div>
</template>

<script>
    import {Mood} from '@/api/article/mood'
    import {User} from '@/api/cms/super'
    import {Category} from '@/api/cms/category'
    import {Tag} from '@/api/cms/tag'
    import tableMixin from '@/mixins/table'
    import flatten from 'lodash/flatten'
    import uniqBy from 'lodash/uniqBy'
    export default {
        mixins:[tableMixin],
        name: 'SysUser',
        data(){
            return {
                authorList:[],
                tableConfig:{
                    selection:true,
                    searchMenuSpan: 24,
                },
                originTagList:undefined,
                categoryList:undefined,
                tagList:undefined,
                initFormData:{
                    public:0
                }
            }
        },
        computed: {
            tableForm(){
                return [
                    {
                        label: 'ID',
                        prop: 'ids',
                        search:true,
                        hide:true,
                        display:false,
                        searchPlaceholder:'多个ID逗号分隔'
                    },
                    {
                        label: '时间',
                        prop: 'create_data',
                        hide:true,
                        searchOrder:6,
                        display:false,
                        format:'yyyy-MM-dd HH:mm:ss',
                        valueFormat:'yyyy-MM-dd HH:mm:ss',
                        defaultTime:['00:00:00', '23:59:59'],
                        unlinkPanels:true,
                        type:'datetime',
                        dataType:'string',
                        searchSpan:12,
                        searchRange:true,
                        search:true,
                        width:90
                    },
                    {
                        label: '内容',
                        $type:'editor_1',
                        prop: 'content',
                        searchOrder:1,
                        search: true,
                        hide:true,
                        formslot:true,
                    },
                    {
                        label: '内容',
                        prop: 'contentTxt',
                        display:false
                    },
                    {
                        label: '图片',
                        prop: 'cover',
                        type: 'upload',
                        ...this.uploadConfig,
                    },
                    {
                        label: '状态',
                        prop: 'public',
                        searchOrder:2,
                        slot:true,
                        search:true,
                        type: "radio",
                        $type: "status",
                        button: true,
                        props:{
                            label:"label",
                            value:'value'
                        },
                        dicData:[
                            {label:'公开',value:0},
                            {label:'私密',value:1}
                        ]
                    },
                    {
                        label: '分类',
                        prop: 'categoryId',
                        searchOrder:5,
                        formslot:true,
                        searchFilterable:true,
                        search:true,
                        type:'radio',
                        props:{
                            label:'name',
                            value:'id'
                        },
                        dicData:this.categoryList
                    },
                    {
                        label: '标签',
                        hide:true,
                        search:true,
                        searchOrder:4,
                        searchFilterable:true,
                        prop: 'tagId',
                        formslot:true,
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
                        type:'select',
                        searchOrder:3,
                        searchFilterable:true,
                        search:this.userInfo.isLock?false:true,
                        searchValue:this.userInfo.id,
                        display:false,
                        props:{
                            label:"nickname",
                            value:"id"
                        },
                        dicData:this.authorList
                    },
                    {
                        label: '操作人',
                        prop: 'operateId',
                        type:'select',
                        props:{
                            label:"nickname",
                            value:"id"
                        },
                        dicData:this.authorList,
                        hide:true,
                        display:false
                    },
                    {
                        label: '发布时间',
                        format:'yyyy-MM-dd HH:mm:ss',
                        valueFormat:'yyyy-MM-dd HH:mm:ss',
                        type:'datetime',
                        width:90,
                        prop: 'create_time',
                    },
                ]
            }
        },
        async created() {
            this.searchSendData.authorId=this.userInfo.id
            this.authorList=await new User().get()
            this.categoryList=await new Category().get()
            this.originTagList=await new Tag().get()
            this.onlyTagList=this.originTagList.filter(i=>!i.categories.length)
            this.tagList=JSON.parse(JSON.stringify(this.originTagList))
        },
        methods: {
            tableGetCallBack(rows){
                return rows.map(i=>{
                    i.contentTxt=i.content.replace(/<[^>]+>/g,"").replace(/&nbsp;/g,"")
                    return i
                })
            },
            cancelClick(e){
                if(e===this.sendFormData.categoryId && this.sendFormData.tagId.length){
                    this.$message.error('请先取消分类下的标签再取消分类')
                    return
                }
                e===this.sendFormData.categoryId?this.sendFormData.categoryId='':this.sendFormData.categoryId=e
                this.changeCategory(this.sendFormData.categoryId || '')
            },
            changeTag(e){
                if(e.length>3){
                    this.$message.error('最多选择3个标标签')
                }else {
                    this.sendFormData.tagId=e
                }
            },
            beforeWillOpen(){
                this.changeCategory(this.sendFormData.categoryId)
            },
            changeCategory(e){
                if(e){
                    this.tagList=this.categoryList.find(i=>i.id===e).tags.concat(this.onlyTagList)
                }else {
                    this.tagList=this.originTagList
                }
            },
            batchSubmitApi(data){
                return new Mood().deleteMore(data)
            },
            rowUpdateApi(data){
                return new Mood().put(data)
            },
            rowSaveApi(data){
                return new Mood().post(data)
            },
            rowDeleteApi(id,data){
                return new Mood().delete(id,data)
            },
            tableGetApi(data){
                return new Mood().get(this.userInfo.isLock?{authorId:this.userInfo.id,...data}:data)
            },
        }
    }
</script>
<style lang="scss" scoped>
    .categoryIdWrapper {
        >>> .el-radio {
            margin-left: 0!important;
            margin-bottom: 5px;
            margin-right: 10px;
        }
        >>> .el-checkbox {
            margin-right: 10px!important;
        }
    }
</style>

