<template>
  <span @click="logsFlag?'':handleOpen()">
    <el-badge
        :value="logsFlag?'':logsLen"
        :max="99">
      <i class="icon-bug"/>
    </el-badge>
        <el-dialog
            append-to-body
            :visible.sync="box" :fullscreen="fullscreen" class="avue-dialog avue-crud__dialog">
            <div slot="title"
                 class="avue-crud__dialog__header">
                <span class="el-dialog__title">日志</span>
                <div class="avue-crud__dialog__menu">
                    <i @click="fullscreen=!fullscreen"
                       class="el-dialog__close el-icon-full-screen"></i>
                </div>
            </div>
                 <logs/>
       </el-dialog>
  </span>
</template>

<script>
    import {mapGetters} from 'vuex'
    import logs from '@/page/logs/index'

    export default {
        name: 'TopLogs',
        components: {logs},
        data() {
            return {
                fullscreen: false,
                box: false
            }
        },
        created() {
        },
        mounted() {
        },
        computed: {
            ...mapGetters(['logsFlag', 'logsLen'])
        },
        methods: {
            handleOpen() {
                this.box = true
            }
        }
    }
</script>

<style lang="scss" scoped>
</style>
