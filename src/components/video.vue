<template>
    <div>
        <el-dialog
            :append-to-body="true"
            :title="title"
            :visible="videoDialog"
            :before-close="beforeClose"
            width="50%"
            >
            <div id="ckplayer"></div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "video",
        props:['title','videoDialog','currentSrc','live'],
        data() {
            return {

            }
        },
        methods: {
            beforeClose(done){
                this.$emit('update:videoDialog',false)
                done()
            },
            ckplayera () {

                setTimeout(()=> {
                    console.log(this.currentSrc)
                    const videoObject = {
                        html5m3u8: true,
                        container: '#ckplayer',  // 容器的ID或className
                        variable: 'player',  // 播放函数名称 与下面一致
                        autoplay: true,   // 是否自动播放
                        live: this.live,  // 是否是直播视频 true = 直播，false = 点播
                        mobileCkControls: false,  // 是否在移动端（包括ios）环境中显示控制
                        video: this.currentSrc  // hls地址
                    }
                    // rtmp://rtmp01open.ys7.com/openlive/3c417bd16df54d26bb77240b04b8e6d4
                    const player = new ckplayer(videoObject)
                }, 2)
            }
        },
        created () {
            console.log(55)
            this.ckplayera()
        }

    }
</script>

<style scoped lang="scss">
    >>> .el-dialog__body {
        padding-top: 0!important;
    }
    #ckplayer {
        width: 100%;
        height: 30vw;
    }
</style>