
<template>
    <basic-container>
        <el-tabs v-model="selectForm.type">
            <el-tab-pane label="信息管理" name="updateUserForm"/>
            <el-tab-pane label="密码管理" name="changePasswordForm"/>
        </el-tabs>
        <public-form></public-form>
    </basic-container>
</template>

<script>
    import formMixin from '@/mixins/form'
    import {mapGetters} from 'vuex'
    import {User} from '@/api/cms/user'
    export default {
        mixins:[formMixin],
        data() {
            return {
                selectForm:{
                    type:"updateUserForm",
                    changePasswordForm:[
                        {
                            label: '旧密码',
                            prop: 'old_password',
                        },
                        {
                            label: '新密码',
                            prop: 'new_password',
                        },
                        {
                            label: '确认密码',
                            prop: 'confirm_password',
                        }
                    ],
                    updateUserForm:[
                        {
                            label: '昵称',
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
                        },
                        {
                            label: '个性签名',
                            prop: 'signature',
                            type: 'textarea',
                            minRows: 2
                        }
                    ]
                }
            }
        },
        computed:{
            formColumn(){
                const type=this.selectForm.type
                return this.selectForm[type]
            }
        },
        created() {
            this.initFormMethods(this.userInfo)
        },
        methods: {
            rowSaveApi(data){
                const type=this.selectForm.type
                return type==='updateUserForm'?User.self(data):User.password(data)
            },
            rowSaveCallback(data){
                const {nickname,avatar,email} =data
                this.$store.commit('SET_USER_INFO',{nickname,avatar,email})
            }
        }
    }
</script>
<style>

</style>
