import {mapGetters} from 'vuex'
import publicForm from '@/components/public-form'
export default {
    provide () {
        return {
            $provide:this
        }
    },
    data() {
        return{
            sendFormData:{},
            baseFormOptions:{
                emptyBtn:false,
                submitText: '保存',
            }
        }
    },
    components:{
        publicForm
    },
    computed: {
        ...mapGetters(['avueConfig']),
        formOptions(){
            this.formConfig && Object.assign(this.baseFormOptions,this.formConfig)
            const column=this.initFormRules(this.formColumn)
            return {...this.baseFormOptions,column:column,size:this.avueConfig.size}
        }
    },
    created(){
        //先执行
        this.formGetApi && this.formGetApi().then(res=>{
            this.initFormMethods(res)
        })
        /*this.$nextTick(()=>{
            const ele=document.querySelectorAll('input[type="file"]')
            console.log(ele,'==')
        })*/
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
        initFormMethods(data){
            this.formColumn.map(item=>{
                let {prop}=item,val=data[prop];
                this.sendFormData[prop]=val
            })
        },
        formSave(form,done){
            const needSendFormData=this.needSendFormData(form)
            this.rowSaveApi(needSendFormData).then(res=>{
                this.$message.success(res.message)
                this.rowSaveCallback && this.rowSaveCallback(form)
                done && done()
            }).catch(_=>{
                done && done()
            })
        },
        formCancel(){
        
        }
    }
}