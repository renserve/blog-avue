<template>
    <basic-container>
        <template v-if="isOpenCloud">
            <div class="controlWrap" v-if="userInfo.groupIds.includes(1) && otherCloud">
                <el-radio-group v-model="userId" size="small" @change="getCloud">
                    <el-radio-button v-for="i in authorList" :key="i.id" :label="i.id" border>
                        {{i.username}}
                    </el-radio-button>
                </el-radio-group>
            </div>
            <avue-echart-wordcloud v-if="!loadWordcloudData" :key="cloudKey" ref="echart" :option="wordcloudConfig" :data="wordcloudData" width="100%"></avue-echart-wordcloud>
        </template>
    </basic-container>
</template>

<script>
    import {Idea} from '@/api/cms/idea'
    import {mapGetters} from 'vuex'
    import {User} from '@/api/cms/super'
    export default {
        name: 'Wel',
        data() {
            return {
                userId:'',
                wordcloudData:[],
                authorList:[],
                loadWordcloudData:false
            }
        },
        computed: {
            cloudKey(){
                return this.userId+JSON.stringify(this.wordcloudConfig)
            },
            ...mapGetters(['wordcloudConfig','userInfo','currentMenuModelId','otherCloud','cloudCount','isOpenCloud'])
        },
        methods: {
            getCloud(authorId){
                this.loadWordcloudData=true
                new Idea().get({page:0,count:this.cloudCount,authorId}).then(res=>{
                    this.wordcloudData=res.rows.filter(i=>i.status)
                    this.loadWordcloudData=false
                })
            },
            async refresh(){
                if(this.isOpenCloud){
                    this.getCloud(this.userId)
                    if(this.userInfo.groupIds.includes(1)){
                        this.authorList=await new User(this.currentMenuModelId).get()
                    }
                }
            }
        },
        created() {
            this.userId=this.userInfo.id
            this.refresh()
        }
    }
</script>

<style scoped="scoped" lang="scss">
    .controlWrap {
        margin-bottom: 30px;
    }
</style>
