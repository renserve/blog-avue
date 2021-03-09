<template>
    <el-form
        ref="loginForm"
        :rules="loginRules"
        :model="loginForm"
        class="login-form"
        status-icon
        label-width="0">
        <el-form-item prop="username">
            <el-input
                v-model="loginForm.username"
                size="small"
                auto-complete="off"
                placeholder="请输入用户名"
                @keyup.enter.native="handleLogin">
                <i
                    slot="prefix"
                    class="icon-yonghu"/>
            </el-input>
        </el-form-item>
        <el-form-item prop="password">
            <el-input
                :type="passwordType"
                v-model="loginForm.password"
                size="small"
                auto-complete="off"
                placeholder="请输入密码"
                @keyup.enter.native="handleLogin">
                <i
                    slot="suffix"
                    class="el-icon-view el-input__icon"
                    @click="showPassword"/>
                <i slot="prefix" class="iconfont icon-mima"></i>
            </el-input>
        </el-form-item>
        <el-form-item>
            <el-button
                :type="colorControl?'primary':'info'"
                size="small"
                class="login-submit"
                @click.native.prevent="handleLogin">登录
            </el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import {randomLenNum} from '@/util/util'
    import {setCookie, getCookie} from '@/util/cookie'
    import {mapGetters} from 'vuex'

    export default {
        name: 'Userlogin',
        data() {
            return {
                loginForm: {
                    username: '',
                    password: ''
                },
                checked: false,
                loginRules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                    ]
                },
                passwordType: 'password'
            }
        },
        created() {

        },
        mounted() {
        },
        computed: {
            colorControl(){
                return !Object.values(this.loginForm).filter(i=>!i).length
            },
            ...mapGetters(['tagWel'])
        },
        props: [],
        methods: {
            showPassword() {
                this.passwordType == ''
                    ? (this.passwordType = 'password')
                    : (this.passwordType = '')
            },
            handleLogin() {
                this.$refs.loginForm.validate(valid => {
                    if (valid) {
                        this.$store.dispatch('LoginByUsername', this.loginForm).then(() => {
                            // console.log(this.tagWel.value)
                            this.$router.push({path: this.tagWel.value})
                        }).catch(() => {})
                    }
                })
            }
        }
    }
</script>

<style>
</style>
