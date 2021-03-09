<template>
    <div
        :class="{'avue--collapse':isCollapse}"
        class="avue-contail">
        <div class="avue-header">
            <!-- 顶部导航栏 -->
            <top/>
        </div>

        <div class="avue-layout">
            <div class="avue-left">
                <!-- 左侧导航栏 -->
                <sidebar/>
            </div>
            <div class="avue-main">
                <!-- 顶部标签卡 -->
                <tags/>
                <!-- 主体视图层 -->
                <el-scrollbar style="height:100%">
                    <keep-alive>
                        <router-view
                            v-if="$route.meta.$keepAlive"
                            class="avue-view"/>
                    </keep-alive>
                    <router-view
                        v-if="!$route.meta.$keepAlive"
                        class="avue-view"/>
                </el-scrollbar>

            </div>
        </div>
        <div
            class="avue-shade"
            @click="showCollapse"/>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import tags from './tags'
    import top from './top/'
    import sidebar from './sidebar/'
    import admin from '@/util/admin'
    import {resetRouter} from '@/router/router'

    let $vm;
    export default $vm = {
        name: 'Index',
        provide() {
            return {
                currentMenus: this.currentMenus,
                openMenu: this.openMenu
            };
        },
        components: {
            top,
            tags,
            sidebar
        },
        data() {
            return {
                // 刷新token锁
                refreshLock: false,
                // 刷新token的时间
                refreshTime: '',
                // 计时器
                timer: '',
                topChildren: undefined
            }
        },
        destroyed() {
            clearInterval(this.refreshTime)
            clearInterval(this.timer)
            /*
            * 默认关闭websocket，如需工作流通知，则开启
            * this.disconnect()
            */

        },
        mounted() {
            this.init()
            /*
             * 默认关闭websocket，如需工作流通知，则开启
             * this.initWebSocket()
            */
        },
        computed: {
            ...mapGetters(['topMenus', 'isCollapse', 'menus']),
            currentMenus() {
                return this.topChildren || this.menus
            },
        },
        methods: {
            showCollapse() {
                this.$store.commit('SET_COLLAPSE')
            },
            openMenu(index) {
                // topMenus
                this.topChildren = this.topMenus[index]
            },
            // 屏幕检测
            init() {
                this.$store.commit('SET_SCREEN', admin.getScreen())
                window.onresize = () => {
                    setTimeout(() => {
                        this.$store.commit('SET_SCREEN', admin.getScreen())
                    }, 0)
                }
            }
        }
    }
</script>
