<template>
    <div class="login-container">
        <div class="login-weaper  animated bounceInDown">
            <div class="login-logo">
                <img src="@/assets/avator.jpg" alt="">
            </div>
            <p class="login-tip">后台管理系统</p>
            <div class="login-border">
                <div class="login-main">
                    <userLogin v-if="activeName==='user'"/>
                </div>
            </div>
        </div>
        <top-color v-show="false"/>
    </div>
</template>
<script>
    import userLogin from './userlogin'
    import {mapGetters} from 'vuex'
    import {getStore, setStore} from '@/util/store'
    import topColor from '@/page/index/top/top-color'
    export default {
        name: 'Login',
        components: {
            userLogin,
            topColor
        },
        data() {
            return {
                tenantList: [],
                active: '',
                activeName: 'user',
                socialForm: {}
            }
        },
        created() {
            this.watermark()
            this.active = getStore({name: 'tenantId'})
        },
        mounted() {
        },
        computed: {
            ...mapGetters(['website', 'tagWel'])
        },
        methods: {
            watermark() {
                const text = ''
                const canvas = document.createElement('canvas')
                canvas.width = '500'
                canvas.height = '200'
                const ctx = canvas.getContext('2d')
                ctx.clearRect(0, 0, 200, 200) // 绘制之前画布清除
                ctx.font = '30px 黑体'
                ctx.rotate(-20 * Math.PI / 180) // 为了实现水印倾斜效果,旋转画布坐标系
                ctx.fillStyle = 'rgba(100,100,100,0.15)' // 画笔颜色
                ctx.fillText(text, -20, 200) // 书写的内容及位置
                ctx.rotate('20*Math.PI/180') // 坐标系还原,如果后续没有其他操作,这一步可以省略
                // 将canvas的内容转换为base64编码
                const data = canvas.toDataURL('image/png', 1) // 1表示质量(无损压缩)

                window.onload = () => {
                    const background = 'url(' + data + ') repeat'
                    var watermark = document.createElement('div')
                    watermark.style.width = '100%'
                    watermark.style.height = '100%'
                    watermark.style.position = 'fixed'
                    watermark.style.left = '0'
                    watermark.style.top = '0'
                    watermark.style.pointerEvents = 'none'
                    watermark.style.background = background
                    watermark.style.zIndex = '9999'
                    document.body.append(watermark)
                }
            }
        }
    }
</script>

<style lang="scss">
    @import "@/styles/login.scss";
</style>
