<template>
    <div class="avue-top">
        <div class="top-bar__left">
            <div
                v-if="showCollapse"
                :class="[{ 'avue-breadcrumb--active': isCollapse }]"
                class="avue-breadcrumb">
                <i
                    class="icon-navicon"
                    @click="setCollapse"/>
            </div>
        </div>
        <div class="top-bar__title">
            <div
                v-if="showMenu"
                class="top-bar__item top-bar__item--show">
                <top-menu/>
            </div>
        </div>
        <div class="top-bar__right">
            <el-tooltip
                v-if="showColor"
                class="clickable"
                effect="dark"
                content="主题色"
                placement="bottom">
                <div class="top-bar__item">
                    <top-color/>
                </div>
            </el-tooltip>
            <el-tooltip
                class="clickable"
                v-if="showDebug"
                :content="logsFlag?'没有错误日志':`${logsLen}条错误日志`"
                effect="dark"
                placement="bottom">
                <div class="top-bar__item">
                    <top-logs/>
                </div>
            </el-tooltip>
            <el-tooltip
                class="clickable"
                v-if="showLock"
                effect="dark"
                content="锁屏"
                placement="bottom">
                <div class="top-bar__item">
                    <top-lock/>
                </div>
            </el-tooltip>
            <el-tooltip
                class="clickable"
                v-if="showTheme"
                effect="dark"
                content="特色主题"
                placement="bottom">
                <div class="top-bar__item top-bar__item--show">
                    <top-theme/>
                </div>
            </el-tooltip>
            <el-tooltip
                class="clickable"
                v-if="showFullScren"
                :content="isFullScren?'退出全屏':'全屏'"
                effect="dark"
                placement="bottom">
                <div class="top-bar__item">
                    <i
                        :class="isFullScren?'icon-zuixiaohua':'icon-quanpingzuidahua'"
                        @click="handleScreen"/>
                </div>
            </el-tooltip>
            <el-tooltip
                effect="dark"
                content="用户头像"
                placement="bottom">
                <img
                    :src="userInfo.avatar"
                    id="thumbnail"
                    class="top-bar__img">
            </el-tooltip>
            <el-dropdown trigger="click">
                <span class="el-dropdown-link clickable">
                  {{ userInfo.username }}
                  <i class="el-icon-arrow-down el-icon--right"/>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                        <router-link to="/">首页</router-link>
                    </el-dropdown-item>
                    <el-dropdown-item divided>
                        <router-link to="/cms/info">个人信息</router-link>
                    </el-dropdown-item>
                    <el-dropdown-item
                        divided
                        @click.native="$refs.seting.open()">界面设置
                    </el-dropdown-item>
                    <el-dropdown-item
                        divided
                        @click.native="logout">退出系统
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <top-setting ref="seting"/>
        </div>
    </div>
</template>
<script>
    import {mapGetters, mapState} from 'vuex'
    import {fullscreenToggel, handleImg, listenfullscreen} from '@/util/util'
    import topLock from './top-lock'
    import topMenu from './top-menu'
    import topTheme from './top-theme'
    import topLogs from './top-logs'
    import topColor from './top-color'
    import topSetting from './top-setting'

    export default {
        name: 'Top',
        components: {
            topLock,
            topMenu,
            topTheme,
            topLogs,
            topColor,
            topSetting
        },
        filters: {},
        data() {
            return {}
        },
        computed: {
            ...mapState({
                showDebug: state => state.common.showDebug,
                showTheme: state => state.common.showTheme,
                showLock: state => state.common.showLock,
                showFullScren: state => state.common.showFullScren,
                showCollapse: state => state.common.showCollapse,
                showMenu: state => state.common.showMenu,
                showColor: state => state.common.showColor
            }),
            ...mapGetters([
                'isFullScren',
                'tagWel',
                'tagList',
                'isCollapse',
                'tag',
                'logsLen',
                'logsFlag'
            ])
        },
        created() {

        },
        mounted() {
            listenfullscreen(this.setScreen)
        },
        methods: {
            handleScreen() {
                fullscreenToggel()
            },
            setCollapse() {
                this.$store.commit('SET_COLLAPSE')
            },
            setScreen() {
                this.$store.commit('SET_FULLSCREN')
            },
            logout() {
                this.$confirm('是否退出系统, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$store.dispatch('FedLogOut').then(() => {
                        this.$router.push({path: '/login'})
                    })
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .clickable {
        cursor: pointer;
    }
</style>
