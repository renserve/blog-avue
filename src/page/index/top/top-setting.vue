<template>
    <div class="setting">
        <div
            :class="{'setting__shade--show':isShade}"
            class="setting__shade"
            @click="close"/>
        <div
            :class="{'setting__content--show':box}"
            class="setting__content">
            <el-scrollbar>
                <!--<div class="setting__header">
                    字符云
                </div>
                <div class="setting__header">
                    个性化
                    <small>(滑动鼠标下面还有更多设置)</small>
                </div>-->
                <div class="setting__body setting__form">
                    <avue-form
                        v-model="form"
                        :option="option">
                    </avue-form>
                </div>
            </el-scrollbar>
        </div>
    </div>
</template>

<script>
import {mapState, mapGetters} from 'vuex'
import {option, list} from '@/const/setting/'
import isNumber from 'lodash/isNumber'
export default {
    data() {
        return {
            box: false,
            customKey: [],
            form: {},
            list: list,
            avueConfigKey:[],
            wordcloudConfigKey:[],
            option: option(this)
        }
    },
    computed: {
        ...mapGetters(['isShade', 'avueConfig','wordcloudConfig','otherCloud','cloudCount','isOpenCloud']),
        ...mapState({
            showTag: state => state.common.showTag,
            showDebug: state => state.common.showDebug,
            showLock: state => state.common.showLock,
            showColor: state => state.common.showColor,
            showFullScren: state => state.common.showFullScren,
            showCollapse: state => state.common.showCollapse,
            showSearch: state => state.common.showSearch,
            showMenu: state => state.common.showMenu,
            showTheme: state => state.common.showTheme
        })
    },
    created() {
        this.avueConfigKey=Object.keys(this.avueConfig)
        this.wordcloudConfigKey=Object.keys(this.wordcloudConfig)
        this.customKey = [...this.avueConfigKey,...this.wordcloudConfigKey]
        setTimeout(() => {
            this.init()
        }, 0)
    },

    methods: {
        close() {
            this.box = false
            this.$store.commit('SET_SHADE', false)
        },
        set(key) {
            const ele = this.find(key)
            setTimeout(() => {
                // console.log(eval(this.form[ele.key]),'isOpenCloud')
                if (this.customKey.includes(ele.key)) {
                    //todo 事件机制问题
                    this.$store.commit(ele.commit, [ele.key, this.form[ele.key]])
                } else {
                    this.$store.commit(ele.commit, eval(this.form[ele.key]))
                }
            }, 0)
        },
        find(key) {
            return this.list.filter(ele => ele.key === key)[0]
        },
        init() {
            this.list.forEach(ele => {
                if (!this.customKey.includes(ele.key)) {
                    const val=this[ele.key]
                    this.form[ele.key] = this.validatenull(val) ? 'true' : isNumber(val)?val:val+''
                    this.set(ele.key)
                } else {
                    if(this.avueConfigKey.includes(ele.key)){
                        this.form[ele.key] = this.avueConfig[ele.key]
                    } else if(this.wordcloudConfigKey.includes(ele.key)){
                        this.form[ele.key] = this.wordcloudConfig[ele.key]
                    }
                }
            })
        },
        open() {
            this.box = true
            this.$store.commit('SET_SHADE', true)
        }
    }
}
</script>

<style lang="scss" scoped>
//弹框
/*>>> .el-collapse-item>div[role="tab"] {
    display: block!important;
}*/
>>> .el-scrollbar {
    height: 100vh !important;

    .el-scrollbar__wrap {
        overflow-x: hidden !important;
    }
}

.setting {
    margin-left: 10px;

    &__icon {
        color: #fff;
        font-size: 20px;
        transform: rotate(90deg);
    }

    &__header {
        height: 42px;
        line-height: 42px;
        padding: 0 15px;
        border-bottom: 1px solid #f6f6f6;
        color: #333;
        border-radius: 2px 2px 0 0;
        font-size: 14px;

        small {
            margin-left: 8px;
            color: #999;
        }
    }

    &__body {
        padding: 10px 15px;
        line-height: 24px;
    }

    &__about {
        font-size: 14px;
        line-height: 30px;
    }

    &__shade {
        position: fixed;
        display: none;
        width: 100%;
        height: 100%;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.3);
        z-index: 2048;

        &--show {
            display: block;
        }
    }

    &__form {
        /*width: 230px;*/
        /*margin: 0 auto;*/
    }

    &__content {
        box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.1);
        transition: all 0.3s;
        position: fixed;
        width: 320px;
        height: 100%;
        right: -450px;
        top: 0;
        z-index: 2048;
        background-color: #fff;

        &--show {
            right: 0;
        }
    }
}
</style>
