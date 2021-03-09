import {mapGetters} from 'vuex'
import omit from 'lodash/omit'
import isString from 'lodash/isNumber'
export default {
    data() {
        return{

        }
    },
    methods: {
        initFormRules(data,hasGroup){
            const span=this.avueConfig.span
            data=JSON.parse(JSON.stringify(data))
            return data.map(item=>{
                if(!hasGroup){
                    if(item.$required){
                        let trigger,message;
                        switch (item.$type){
                            case 'radio':{
                                trigger='input'
                                message='请选择'+item.label
                                break
                            }
                            case 'select':{
                                trigger='change'
                                message='请选择'+item.label
                                break
                            }
                            case 'image':{
                                trigger='change'
                                message='请上传'+item.label
                                break
                            }
                            default :{
                                trigger='blur'
                                message="请输入"+item.label
                                break
                            }
                        }
                        item.rules=[{required: true,message: message,trigger: trigger}]
                    }
                    if(!item.span){
                        item.row=true
                        item.span=span
                    }
                }else {
                    item.display=false
                }
                return omit(item, ['$type','$required'])
            })
        },
        needSendFormData(data){
            const keys=Object.keys(data)
            keys.map(key=>{
                if(!isString(data[key]) && key!=='content'){
                    data[key]=this.$xss(data[key])
                }
            })
            console.log(data,'data')
            this.beforeSendFormData && this.beforeSendFormData(data)
            return omit(data,keys.filter(i=>/\$/.test(i)))
        }
    },
    computed:{
        ...mapGetters([
            'userInfo',
            'modelOptions',
            'imageDomin',
            'reqloading',
        ])
    }
}
