<template>
    <div class="main" v-loading.lock="loadingFlag">
        <el-row>
            <el-col><h3>{{article.title}}</h3></el-col>
        </el-row>
        <el-row class="title">
            <el-col>
                <span>{{article.createddate}}</span>&nbsp;&nbsp;
                分类: <span>{{article.arttype}}</span>
                <span class="el-icon-document readcount">({{article.readcount}})</span>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <hr>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <div v-html="article.content"></div>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <span>网友评论</span>
                <el-input
                    v-model="textarea"
                    type="textarea"
                    :autosize="{ minRows: 3, maxRows: 5}"
                    placeholder="请输入评论内容">
                </el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <el-button type="primary" size="small" @click="onSubmit">提交</el-button>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <div>全部评论</div>
                <hr>
            </el-col>
        </el-row>
        <el-row>
            <panelList-wrapper :data-url='remote' :pager='pager' :remoteParam="remoteParam">
                <panel-wrapper headerHeight="20px" imgWidth="45px" slot-scope='scope' class="comment-container" headerBgColor='#fff' :bordered='false'
                               :innerBordered='false'>
                    <img :onerror="errorUserImg" slot="img" :style="{height: 'auto'}"
                         :src="root + 'main/getStaffImg.do?staffID=' + scope.item.userid + '&dt=' + Math.random()">
                    <div slot='header' class="head" v-html="scope.item.username + '&nbsp;&nbsp;' + scope.item.commentdate"></div>
                    <div class='body' v-html='scope.item.commentcontent'></div>
                    <div slot='footer' class='footer'>
                        <el-button type='text' size='mini'  @click="giveUp(scope.item.commentid)"><i class='el-icon-star-off'></i>点赞</el-button>(<span>{{ scope.item.praisecount }}</span>)&nbsp;
                        <el-button type='text' size='mini' @click="showSubReveicer(scope.item.commentid)"><i class='el-icon-edit'></i>回复</el-button>(<span>{{ scope.item.receivecount }}</span>)
                        <transition name="el-zoom-in-top">
                            <div v-show="receiveShowIndex==scope.item.commentid">
                                <el-input
                                    v-model="subReceiver"
                                    type="textarea"
                                    :autosize="{ minRows: 3, maxRows: 5}"
                                    placeholder="请输入评论内容">
                                </el-input>
                                <el-button type="primary" size="mini" @click="reply(scope.item.commentid)">回复</el-button>
                            </div>
                        </transition>
                    </div>
                </panel-wrapper>
            </panelList-wrapper>
        </el-row>
    </div>
</template>

<script>

    import loadData from '@assets/js/loadData'
    import defaultImg from '@assets/images/pic01.jpg'
    import ElButton from '../../../node_modules/element-ui/packages/button/src/button.vue'

    export default {
        components: {ElButton},
        name: 'BlogLister',
        mixins: [loadData],
        mounted() {
            let _this = this,
                artID = this.$route.query.id,
                artUrl = process.env.ROOT_API + 'article/getObjByID.do?objid=' + artID,
                artSuccess = response => {
                    _this.article = JSON.parse(response.bodyText).data
                    setTimeout(() => {
                        _this.loadingFlag = false
                    }, 500)
                };
            this.sendGet({url: artUrl, success: artSuccess})
        },
        data() {
            return {
                receiveShowIndex: 0,
                errorUserImg: `this.src='${defaultImg}'`,
                root: process.env.ROOT_API,
                remote: process.env.ROOT_API + 'comments/getSuperCommentListByArtID.do',
                remoteParam: {articleID: this.$route.query.id},
                commentList: null,
                pager: {
                    pageSizes: [2, 5],
                    pageSize: 2,
                    pageInt: 1
                },
                loadingFlag: true,
                textarea: '',
                subReceiver: '',
                article: {
                    title: '',
                    readcount: '',
                    createddate: '',
                    content: ''
                }
            }
        },
        methods: {
            showSubReveicer(commentid) {
                if(this.receiveShowIndex === commentid) {
                    this.receiveShowIndex = -1;
                }
                else {
                    this.receiveShowIndex = commentid;
                }
            },
            onSubmit: function() {
                if(this.textarea !== "") {
                    let url = process.env.ROOT_API + 'comments/releaseComment.do',
                        param = {'articleID': this.$route.query.id, 'content': this.textarea},
                        success = () => {
                            this.$message.success('发表成功')
                        },
                        error = () => {
                            this.$message.error('发表失败')
                        };
                    this.sendPost({url, param, success, error});
                }
                else{
                    this.$alert("请输入您的评论");
                }
            },
            giveUp: function(value) {
                this.$http.get(process.env.ROOT_API + 'comments/addPraiseCount.do?objid=' + value);
            },
            reply: function(commentid) {
                let replyContent = this.replyContent;
                let articleID = this.$route.query.id;
                this.$http.post(process.env.ROOT_API + 'comments/receiveComments.do',
                    {
                        'articleID': articleID,
                        'commentsID': commentid,
                        'content': replyContent
                    }, {emulateJSON: true})
            }
        }
    }

</script>

<style scoped>
    .main {
        margin: 20px 0 0 -20px;
        width: 780px;
    }
    .main .readcount {
        float: right;
    }
    .title {
        font-size: 15px;
        color: #aaa;
    }
    /*
        自定义评论面板
    */
    .comment-container {
        height: auto!important;
    }
    .comment-container .head {
        font-size: 13px;
    }
    .comment-container >>> .panel-wrapper-container {
        bottom: auto;
        position: relative;
        left: 0!important;
        display: inline-block;
        vertical-align: top;
        width: 90%;
    }
    .comment-container >>> .panel-wrapper-img-container {
        height: auto!important;
        position: relative;
        display: inline-block;
        vertical-align: top;
    }
    .comment-container .panel-wrapper-img-container img {
        height: 45px!important;
        border-radius: 45px;
    }
    .comment-container >>> .panel-wrapper-container .panel-wrapper-body {
        top: 0!important;
        bottom: auto!important;
        position: relative;
    }
    .comment-container >>> .panel-wrapper-container .panel-wrapper-footer {
        position: relative;
        top: auto!important;
        bottom: auto!important;
        height: auto!important;
    }

</style>
