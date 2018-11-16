<template>
    <div>
        <el-row>
            <el-col>
                <div id="toolbar">
                    <b style="float: left">发表评论</b>
                    &nbsp;&nbsp;&nbsp;
                    <button>
                        <i class="icon iconfont icon-face" @click="showEmoji = !showEmoji"></i>
                        <transition name="fade" mode="">
                            <div class="emoji-box" v-if="showEmoji">
                                <el-button class="pop-close" :plain="true" type="danger" size="mini" icon="el-icon-close" @click="showEmoji = false">
                                </el-button>
                                <vue-emoji @select="selectEmoji">
                                </vue-emoji>
                            </div>
                        </transition>
                    </button>
                </div>
                <quill-editor v-model="commentContent" ref="commentsEditor" :rows="3" :content="commentContent" :options="editorOption">
                </quill-editor>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <div class="emoji-wrapper clearfix">
                    <el-button type="primary" size="small" @click="onSubmit" class="submit">提交</el-button>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <div>全部评论</div>
                <hr>
            </el-col>
        </el-row>
        <el-row v-loading="loadingFlag">
            <panelList-wrapper class="article-comment-list" :data-url='remote' :pager='pager' :remoteParam="remoteParam">
                <panel-wrapper headerHeight="20px" imgWidth="45px" slot-scope='scope' class="comment-container" headerBgColor='#fff' :bordered='false' :innerBordered='false'>
                    <img :onerror="errorUserImg" slot="img" :style="{height: 'auto'}" :src="root + 'main/getStaffImg.do?staffID=' + scope.item.userid + '&dt=' + Math.random()">
                    <div slot='header' class="head" v-html="scope.item.username + '&nbsp;&nbsp;' + scope.item.commentdate"></div>
                    <div class='body' v-html='scope.item.commentcontent'></div>
                    <div slot='footer' class='footer'>
                        <el-button type='text' size='mini' @click="giveUp(scope.item.commentid)"><i class='el-icon-star-off'></i>点赞
                        </el-button>
                        (<span>{{ scope.item.praisecount }}</span>)&nbsp;
                        <el-button type='text' size='mini' @click="showSubReveicer(scope.item.commentid)"><i class='el-icon-edit'></i>回复
                        </el-button>
                        (<span v-if="scope.item.receivecount" @click="showSubCommentsList(scope.item.commentid)"><a href="javascript:;">{{ scope.item.receivecount }}</a></span>
                        <span v-else>0</span>)
                        <transition name="el-zoom-in-top">
                            <div v-show="subreceiveShowIndex==scope.item.commentid">
                                <sub-comment :firstCommentID="scope.item.commentid" :commentID="commentID"></sub-comment>
                            </div>
                        </transition>
                        <!-- <transition name="el-zoom-in-top"> -->
                            <div v-show="receiveShowIndex==scope.item.commentid">
                                <div id="subtoolbar" class="ql-toolbar ql-snow" style="line-height: 26px">
                                    <b style="float: left">回复内容</b>
                                    &nbsp;&nbsp;&nbsp;
                                    <button>
                                        <i class="icon iconfont icon-face" @click="showSubEmoji = !showSubEmoji"></i>
                                        <transition name="fade" mode="">
                                            <div class="emoji-box" v-if="showSubEmoji">
                                                <el-button class="pop-close" :plain="true" type="danger" size="mini" icon="el-icon-close" @click="showSubEmoji = false">
                                                </el-button>
                                                <vue-emoji @select="subSelectEmoji">
                                                </vue-emoji>
                                            </div>
                                        </transition>
                                    </button>
                                </div>
                                <quill-editor v-model="replyContent" ref="replyEditor" :rows="5" :content="replyContent" :options="editorOption1">
                                </quill-editor>

                                <div class="emoji-wrapper clearfix">
                                    <el-button type="primary" size="small" @click="reply(scope.item.commentid)" class="submit">回复
                                    </el-button>
                                </div>
                            </div>
                        <!-- </transition> -->
                    </div>
                </panel-wrapper>
            </panelList-wrapper>
        </el-row>
    </div>
</template>
<script>
import loadData from '@assets/js/loadData'
import defaultImg from '@assets/images/pic01.jpg'
import vueEmoji from '@components/emoji/emoji'
import {quillEditor} from 'vue-quill-editor'
import subComment from '@components/blog/SubCommentList'

export default {
    name: 'CommentList',
    mixins: [loadData],
    components: {vueEmoji, quillEditor, subComment},
    data() {
        return {
            commentContent: '', // 评论内容
            replyContent: '', // 回复内容
            editorOption:{
                placeholder: "请编辑内容",
                modules:{
                    toolbar: '#toolbar'
                }
            },
            editorOption1:{
                placeholder: "请编辑回复内容11111111111",
                modules:{
                    toolbar: '#subtoolbar'
                }
            },
            showEmoji: false,
            showSubEmoji: false,
            subreceiveShowIndex: 0, // 是否展示二级评论列表
            receiveShowIndex: 0,
            errorUserImg: `this.src='${defaultImg}'`,
            root: process.env.ROOT_API,
            remote: process.env.ROOT_API + 'comments/getSuperCommentListByArtID.do',
            remoteParam: {
                articleID: this.$route.query.id
            },
            commentID: '', // 一级评论ID
            pager: {
                pageSizes: [2, 5],
                pageSize: 5,
                pageInt: 1
            },
            loadingFlag: false // 加载动画
        }
    },
    methods: {
        // 选择子级表情框中的表情
        subSelectEmoji(code) {
            // 插入表情
            let reg = /^<p>|<\/p>$/;
            let quill = this.$refs.replyEditor.quill,
                range = quill.getSelection();
            this.replyContent = this.replyContent.replace(reg, '') + this.emoji(code);
            setTimeout(function() {
                quill.setSelection(range.index + 1);
                // console.log("完成");
            }, 100)
        },
        // 选择表情框中的表情
        selectEmoji(code) {
            // 插入表情
            let reg = /^<p>|<\/p>$/;
            let quill = this.$refs.commentsEditor.quill,
                range = quill.getSelection();
            this.commentContent = this.commentContent.replace(reg, '') + this.emoji(code);
            // this.showEmoji = false;
            setTimeout(function() {
                quill.setSelection(range.index + 1);
                // console.log("完成");
            }, 100)
        },
        // 请求二级评论列表
        showSubCommentsList(commentid) {
            this.commentID = commentid
            if (this.subreceiveShowIndex === commentid) {
                this.subreceiveShowIndex = -1
            }
            else {
                this.subreceiveShowIndex = commentid
            }
        },
        // 是否展示回复框
        showSubReveicer(commentid) {
            if (this.receiveShowIndex === commentid) {
                this.receiveShowIndex = -1
            }
            else {
                this.receiveShowIndex = commentid
            }
        },
        // 发表评论
        onSubmit: function() {
            if (this.commentContent !== '') {
                let url = process.env.ROOT_API + 'comments/releaseComment.do',
                    param = {articleID: this.$route.query.id, content: this.commentContent},
                    success = () => {
                        this.$message.success('发表成功')
                        this.commentContent = ''
                        this.remote =
                        process.env.ROOT_API +
                        'comments/getSuperCommentListByArtID.do?random=' +
                        Math.random()
                        this.loadingFlag = false
                    },
                    error = () => {
                        this.$message.error('发表失败')
                    }
                this.loadingFlag = true
                this.sendPost({url, param, success, error})
            }
            else {
                this.$alert('请输入您的评论')
            }
        },
        // 点赞
        giveUp: function(value) {
            let url = process.env.ROOT_API + 'comments/addPraiseCount.do',
                param = {
                    objid: value
                },
                success = (data) => {
                    this.loadingFlag = false // 取消加载动画
                    // 评论刷新
                    this.remote = process.env.ROOT_API + 'comments/getSuperCommentListByArtID.do?random=' + Math.random()
                },
                error = () => {
                    console.log('点赞失败')
                }
            this.loadingFlag = false // 取消加载动画
            this.sendPost({url, param, success, error})
        },
        // 回复一级评论
        reply: function(commentid) {
            if (this.replyContent !== '') {
                let url = process.env.ROOT_API + 'comments/receiveComments.do',
                    param = {
                        articleID: this.$route.query.id,
                        commentsID: commentid,
                        content: this.replyContent
                    },
                    success = () => {
                        this.replyContent = ''
                        this.receiveShowIndex = -1
                        // this.subreceiveShowIndex = commentid //展开二级评论列表
                        this.remote =
                            process.env.ROOT_API +
                            'comments/getSuperCommentListByArtID.do?random=' +
                            Math.random()
                    },
                    error = () => {
                        this.$message.error('回复失败')
                    }
                this.sendPost({url, param, success, error})
            }
            else {
                this.$alert('请输入您的评论')
            }
        }
    }
}
</script>
<style>
    .article-comment-list div:first-child {
        overflow: visible !important;
    }
</style>

<style scoped>
    ul,
    li {
        list-style: none;
    }

    .content-wrapper-th img {
        /* display: block !important; */
        max-width: 100% !important;
    }

    .emoji-wrapper {
        position: relative;
        margin-top: 20px;
        margin-bottom: 10px;
    }

    .iconfont {
        cursor: pointer;
        color: #F7BA2A;
    }

    .emoji-box {
        position: absolute;
        z-index: 10;
        left: 30px;
        top: -200px;
        box-shadow: 0 4px 20px 1px rgba(0, 0, 0, 0.2);
        background: white;
    }

    .pop-close {
        position: absolute;
        border: none;
        color: #FF4949;
        right: 12px;
        top: 12px;
        z-index: 10;
    }

    .clearfix::after {
        content: '';
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }

    .fade-enter, .fade-leave-active {
        opacity: 0;
    }

    .fade-move {
        transition: transform .4s;
    }

    .sub-comment-item {
        border-top: 1px solid #e4e7ed;
    }

    .sub-staff {
        width: 45px !important;
    }

    .sub-header {
        font-size: 12px;
    }

    .main {
        margin: 20px 0 0 -20px;
        width: 780px;
    }

    .main .readcount, .main .author {
        float: right;
        line-height: 1;
    }

    .title {
        font-size: 15px;
        color: #aaa;
    }
    .ql-container.ql-snow {
        border-top: 0;
    }

    /*
        自定义评论面板
    */
    .comment-container {
        height: auto !important;
        overflow: visible !important;
        border-bottom: 1px solid #e4e7ed;
    }

    .comment-container .head {
        font-size: 13px;
    }

    .comment-container >>> .panel-wrapper-container {
        bottom: auto;
        position: relative;
        left: 0 !important;
        display: inline-block;
        vertical-align: top;
        width: 90%;
    }

    .comment-container >>> .panel-wrapper-img-container {
        height: auto !important;
        position: relative;
        display: inline-block;
        vertical-align: top;
    }

    .comment-container .panel-wrapper-img-container img {
        height: 45px !important;
        border-radius: 45px;
    }

    .comment-container >>> .panel-wrapper-container .panel-wrapper-body {
        top: 0 !important;
        bottom: auto !important;
        position: relative;
    }

    .comment-container >>> .panel-wrapper-container .panel-wrapper-footer {
        position: relative;
        top: auto !important;
        bottom: auto !important;
        height: auto !important;
    }
</style>
