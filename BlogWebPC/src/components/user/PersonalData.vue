<template>
    <div>
        <el-row>
            <el-col :span="6" :style="{'text-align': 'center'}">
                <img class="headerImg" :onerror="errorUserPic" :src="url">
            </el-col>
            <el-col :span="9" :offset="1">
                <b v-text="staffName"></b>
            </el-col>
            <!--<el-col :span="6" :offset="2" class="art-count-container">-->
                <!--<br/>-->
                <!--<br/>-->
                <!--<span>-->
                  <!--{{artCount}}-->
                <!--</span>篇-->
            <!--</el-col>-->
        </el-row>
        <el-row>
            <hr/>
        </el-row>
        <el-row class="personal-title-container">
            <el-col :span="8">
                <p class="personal-sub-title">文章</p>
                <p><span id="orgCount" v-text="artCount"></span></p>
            </el-col>
            <el-col :span="8">
                <p class="personal-sub-title">原创</p>
                <p><span id="commentCount" v-text="original"></span></p>
            </el-col>
            <el-col :span="8">
                <p class="personal-sub-title">积分</p>
                <p><span id="scoreCount" v-text="score"></span></p>
            </el-col>
        </el-row>
        <el-row>
            <hr/>
        </el-row>
    </div>
</template>

<script type="text/javascript">

    import loadData from '@assets/js/loadData';
    import defaultImg from '@assets/images/pic01.jpg';

    export default {
        name: 'PersonalData',
        mixins: [loadData],
        data() {
            return {
                errorUserPic: `this.src='${defaultImg}'`
            }
        },
        computed: {
            staffName() {
                return this.$store.state.moduleMenu.staffName
            },
            artCount() {
                return this.$store.state.moduleMenu.artCount
            },
            original() {
                return this.$store.state.moduleMenu.original
            },
            score() {
                return this.$store.state.moduleMenu.score;
            },
            url() {
                return this.$store.state.moduleMenu.staffImgUrl;
            }
        },
        mounted() {
            this.sendGet({
                url : process.env.ROOT_API + "main/getCurStaff.do",
                success(response) {
                    let body = response.bodyText && JSON.parse(response.bodyText);
                    // console.log('请求成功！')
                    // console.log(JSON.parse(response.bodyText))
                    if (body && body.data) {
                        this.$store.dispatch("loginAction", {
                            staffName: body.data.staffName,
                            artCount: body.data.logonOn,
                            original: body.data.staffUUID,
                            score: body.data.isManager
                        });
                    }
                }
            });
        }
    }
</script>

<style>
    img.headerImg {
        width: 55px;
        height: 55px;
        border-radius: 55px;
        font-size: 12px;
    }

    #userName {
        font-size: 12px;
    }

    .art-count-container {
        font-size: 12px;
        color: #aaa;
    }

    hr {
        background-color: #e4e7ed;
        height: 1px;
        border: none;
    }

    .personal-sub-title {
        color: #bbb;
    }

    .personal-title-container {
        text-align: center;
        font-size: 14px;
    }
</style>
