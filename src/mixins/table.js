
import publicCrud from '@/components/public-crud'
import State from '@/components/state'
import modelTab from '@/components/model-tab'
import {mapGetters} from 'vuex'
import isNull from 'lodash/isNull'
import cloneDeep from 'lodash/cloneDeep'

export default {
    provide () {
        return {
            $provide:this
        }
    },
    data() {
        return{
            copySearchSendData:undefined,
            tableLoading:false,
            pageInfo:{
                current: 1,
                total:0,
                size: 10,
            },
            oldSendFormData:undefined,
            sendData:{
                page: 0,
                count: 10,
            },
            initFormData:undefined,
            searchSendData:{},
            openType:"",
            tableData:[],
            sendFormData:{},
            selectTableData:[],
            baseTableOptions:{
                searchIcon:false,
                destroyOnClose:true,
                dialogClickModal:false,
                cancelBtn:true,
                searchMenuSpan: 6,
                index:true,
                columnBtn:false,
                indexLabel:'序号',
                searchBtnText:'查询',
                align: 'center',
                menuAlign: 'center'
            }
        }
    },
    computed:{
        isDialog(){
            return this.baseDialogConfig && this.baseDialogConfig.tableDialogVisiable
        },
        dialogConfig(){
            return {
                ...(this.baseDialogConfig || {}),
                tableOptions:this.initOptions(this.baseDialogConfig || {})
            }
        },
        ...mapGetters(['avueConfig','permissions','permissionButton']),
        tableOptions(){
            return this.initOptions(this)
        }
    },
    components:{
        publicCrud,
        State,
        modelTab
    },
    mounted(){
        // console.log(this.permissionButton,'permissionButton')
        if(this.tableConfig){
            !this.tableConfig.isDelayRequest && this.getTableList()
        }else {
            this.getTableList()
        }
    },
    methods: {
        confirmHtmlWrap(label){
            return  [
                `确认<strong style="color:#f56c6c;">${label}？</strong>`,
                '提示',
                {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ]
        },
        rowTagClick(data,$safe,label='执行此操作'){
            if($safe){
                this.$alert(...this.confirmHtmlWrap(label)).then(_=> {
                    this.rowTagApi(data).then(res=>{
                        this.$message.success(res.message)
                        this.getTableList()
                    })
                }).catch(_=>{})
            }else {
                this.rowTagApi(data).then(res=>{
                    this.$message.success(res.message)
                    this.getTableList()
                })
            }
        },
        initOptions(provide){
            const tableConfig=provide['tableConfig']
            const formGroup=cloneDeep(provide['formGroup'])
            const column=this.initFormRules(provide['tableForm'],formGroup)
            const baseTableOptions=JSON.parse(JSON.stringify(this.baseTableOptions))
            const permissionCode=this.$route.meta.permissionCode
            //权限控制
            const controlButton={}
            if(permissionCode){
                [['_add','addBtn'],['_edit','editBtn'],['_del','delBtn']].map(arr=>{
                    const controlCode=permissionCode+arr[0]
                    controlButton[arr[1]]=this.permissionButton.includes(controlCode)
                })
            }
            const realTableConfig=Object.assign(controlButton,tableConfig)
            Object.assign(baseTableOptions,realTableConfig)
            const options={...baseTableOptions,column:column,size:this.avueConfig.size}
            formGroup && (options.group=formGroup.map(item=>{
                item.column=this.initFormRules(item.column)
                return item
            }))
            return options
        },
        dataComputed(key){
            return this.isDialog && this.baseDialogConfig[key] || this[key]
        },
        selectionChange(list){
            this.selectTableData=list
        },
        batchSubmit(label='执行此批量操作'){
            if(!this.selectTableData.length) return;
            this.$alert(...this.confirmHtmlWrap(label)).then(_=> {
                const ids=this.selectTableData.map(item=>item.id).join(',')
                const data={
                    ids,
                    oldData:ids
                }
                this.batchSubmitApi(data).then(res=>{
                    this.getTableList()
                })
            }).catch(_=>{})
        },
        searchReset(){
            this.searchSendData={}
        },
        searchChange(params={},done){
            const sendData=this.dataComputed('sendData')
            sendData.page=0
            // const pageInfo=this.isDialog?this.dialogConfig.pageInfo:this.pageInfo
            this.searchSendData={
                ...sendData,
                ...params
            }
            this.getTableList(this.searchSendData).then(res=>{
                done && done()
            })
        },
        beforeOpen(done,type)  {
            this.copySearchSendData=cloneDeep(this.searchSendData)
            this.beforeWillOpen && this.beforeWillOpen(type)
            const sendFormData=this.dataComputed('sendFormData')
            const initKeys=this.initFormData && Object.keys(this.initFormData)
            this.openType=type
            if(['view','edit'].includes(type)){
                Object.keys(sendFormData).map(k=>{
                    if(isNull(sendFormData[k])){
                        sendFormData[k]=''
                    }
                })
                // 查看和编辑逻辑
                this.$nextTick(()=>{
                    this.oldSendFormData=cloneDeep(sendFormData)
                })
            }else{
                // !this.initFormData && (this.initFormData=JSON.parse(JSON.stringify(this.sendFormData)))
                //新增逻辑一定要用setTimeout包裹，由于form组件底层一些机制的设计
                Object.keys(sendFormData).map(k=>{
                    if(!initKeys.includes(k)){
                        sendFormData[k]=''
                    }
                })
                this.$nextTick(()=>{
                    initKeys && initKeys.map(k=>{
                        this.$set(this.sendFormData,k,this.initFormData[k])
                    })
                })
            }
            done();
        },
        beforeClose(done,type){
            this.$nextTick(()=>{
                this.sendFormData={}
            })
            this.beforeWillClose && this.beforeWillClose()
            this.searchSendData=Object.assign(this.searchSendData,this.copySearchSendData)
            done()
        },
        expandChange(row,list){
            this.tableConfig.expandRowKeys = []
            if (list.length && row) {
                this.tableConfig.expandRowKeys.push(row.id)
                this.sendFormData=list.filter(i=>i.id===row.id)[0]
            }
        },
        rowSave(form,done,loading){
            console.log(form,'form')
            const sendFormData=this.needSendFormData(form)
            this.rowSaveApi(sendFormData).then(res=>{
                this.$message.success(res.message)
                this.rowSaveCallBack && this.rowSaveCallBack(form)
                this.getTableList()
                done && done();
            }).catch(_=>{
                loading && loading()
            })
        },
        rowDelete(form,index,label='执行此删除操作'){
            // 删除数据
            this.$alert(...this.confirmHtmlWrap(label)).then(_=> {
                this.rowDeleteApi(form.id,{...form,oldData:form}).then(res=>{
                    this.rowDeleteCallBack && this.rowDeleteCallBack(form)
                    this.$message.success(res.message)
                    this.getTableList()
                })
            }).catch(_=>{})
        },
        rowUpdate(form,index,done,loading){
            let sendFormData;
            if(form.isRecord){
                sendFormData=Object.assign({isRecord:form.isRecord},this.needSendFormData(form))
            }else {
                sendFormData=Object.assign({oldData:this.oldSendFormData},this.needSendFormData(form))
            }
            if(form.$safe){
                const label=form.$label || '执行此操作'
                delete form.$safe
                delete form.$label
                this.$alert(...this.confirmHtmlWrap(label)).then(() => {
                    this.rowUpdateApi(sendFormData).then(res=>{
                        this.$message.success(res.message)
                        this.rowUpdateCallBack && this.rowUpdateCallBack(form)
                        this.getTableList()
                        done && done();
                    }).catch(_=>{
                        loading && loading()
                    })
                }).catch(_=>{})
            }else {
                this.rowUpdateApi(sendFormData).then(res=>{
                    this.$message.success(res.message)
                    this.rowUpdateCallBack && this.rowUpdateCallBack(form)
                    this.getTableList()
                    done && done();
                }).catch(_=>{
                    loading && loading()
                })
            }
        },
        getTableList(sendData) {
            //过滤未传数据
            const realSendData={};
            console.log(this.searchSendData,'this.searchSendData')
            let defaultSendData=this.dataComputed('sendData')
            const searchSendData=Object.assign(this.searchSendData,sendData || defaultSendData)
            Object.keys(searchSendData).map(key=>{
                if(searchSendData[key] || typeof(searchSendData[key])==='number'){
                    realSendData[key]=searchSendData[key]
                }
            })
            if(!realSendData.page){
                const pageInfo=this.dataComputed('pageInfo')
                pageInfo.currentPage=1
            }
            if(this.tableGetApi){
                if(this.isDialog){
                    this.baseDialogConfig.tableLoading=true
                }else {
                    this.tableLoading=true
                }
                const pageInfo=this.isDialog?this.baseDialogConfig.pageInfo:this.pageInfo
                return this.tableGetApi(realSendData).then(res=>{
                    this.tableGetCallBack && this.tableGetCallBack(res.rows)
                    pageInfo.total=res.total || 0
                    if(this.isDialog){
                        this.baseDialogConfig.tableLoading=false
                        this.baseDialogConfig.tableData=res.rows
                    }else {
                        this.tableLoading=false
                        this.tableData=res.rows
                    }
                    return Promise.resolve(res)
                }).catch(err=>{
                    if(this.isDialog){
                        this.baseDialogConfig.tableLoading=false
                    }else {
                        this.tableLoading=false
                    }
                    return Promise.resolve(err)
                })
            }
        },
        sizeChange(val) {
            const pageInfo=this.dataComputed('pageInfo')
            const sendData=this.dataComputed('sendData')
            pageInfo.size=val
            sendData.count=val
            this.getTableList()
        },
        currentChange(val) {
            const pageInfo=this.dataComputed('pageInfo')
            const sendData=this.dataComputed('sendData')
            pageInfo.current=val
            sendData.page=val-1
            this.getTableList()
        }
    }
}
