<template>
    <div>
        <el-row>
            <el-col>
                <div>全部评论</div>
                <hr>
            </el-col>
        </el-row>
        <el-row>
            <panelList-wrapper class="article-comment-list" :data-url='remote' :pager='pager' :remoteParam="remoteParam">
                <panel-wrapper headerHeight="20px" imgWidth="45px" slot-scope='scope' class="comment-container" headerBgColor='#fff' :bordered='false' :innerBordered='false'>
                    <img :onerror="errorUserImg" slot="img" :style="{height: 'auto'}" :src="root + 'main/getStaffImg.do?staffID=' + scope.item.userid + '&dt=' + Math.random()">
                    <div slot='header' class="head" v-html="scope.item.username + '&nbsp;&nbsp;' + scope.item.commentdate"></div>
                    <div class='body' v-html='scope.item.commentcontent'></div>
                    <div slot='footer' class='footer'>
                        <el-button type='text' size='mini' @click="giveUp(scope.item.commentid)"><i class='el-icon-star-off'></i>点赞
                        </el-button>
                        (<span>{{ scope.item.praisecount }}</span>)&nbsp;
                        <el-button type='text' size='mini' @click="showSubReveicer(scope.item.commentid, scope.index)"><i class='el-icon-edit'></i>回复
                        </el-button>
                        (<span v-if="scope.item.receivecount" @click="showSubCommentsList(scope.item.commentid)"><a href="javascript:;">{{ scope.item.receivecount }}</a></span>
                        <span v-else>0</span>)
                        <transition name="el-zoom-in-top">
                            <div v-show="subreceiveShowIndex==scope.item.commentid">
                                <sub-comment :subRemote="subRemote" :commentID="commentID" @refreshSubURL="refreshSubURL">
                                </sub-comment>
                            </div>
                        </transition>
                        <transition  name="el-zoom-in-top">
                            <div v-show="receiveShowIndex==scope.item.commentid" class="emoji-wrapper">
                                <div :id="'toolbar-' + scope.index"  class="editor-title" style="line-height: 26px">
                                    <b style="float: left">回复</b>
                                    &nbsp;&nbsp;&nbsp;
                                        <i class="iconfont icon-biaoqing" @click="showReplyEmoji(scope.index)"></i>
                                        <transition name="fade">
                                            <div class="emoji-box" v-if="showSubEmoji">
                                                <el-button class="pop-close" :plain="true" type="danger" size="mini" icon="el-icon-close" @click="showSubEmoji = false">
                                                </el-button>
                                                <angus-vue-emoji
                                                @select="subSelectEmoji">
                                                </angus-vue-emoji>
                                            </div>
                                        </transition>
                                </div>
                                <quill-editor class="editor-content"
                                :ref="'replyEditor' + scope.index"
                                :rows="3"
                                v-model="commentCon[scope.index]"
                                :options="editorOpts(scope.index)"
                                @blur="onEditorBlur($event)"
                                @change="onEditorChange($event)">
                                </quill-editor>

                                <div class="emoji-wrapper clearfix">
                                    <el-button type="primary" size="small" @click="reply(scope.item.commentid)" class="submit">回复
                                    </el-button>
                                </div>
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
import {quillEditor} from 'vue-quill-editor'
import subComment from '@components/blog/SubCommentList'

export default {
    name: 'CommentList',
    mixins: [loadData],
    components: {quillEditor, subComment},
    props: {
        remote: String,
        articleID: String
    },
    watch: {
        articleID() {
            this.remoteParam.articleID = this.articleID
        }
    },
    data() {
        return {
            CommentIndex: -1, // 点击的子评论项的索引
            commentCon: {}, // 二级评论列表内容
            showSubEmoji: false,
            subreceiveShowIndex: 0, // 是否展示二级评论列表
            receiveShowIndex: 0, // 是否展示回复框
            errorUserImg: `this.src='${defaultImg}'`,
            root: process.env.ROOT_API,
            remoteParam: {
                articleID: this.$route.query.id
            },
            subRemote: '', // 二级评论列表地址
            commentID: '', // 一级评论ID
            pager: {
                pageSizes: [2, 5],
                pageSize: 5,
                pageInt: 1
            }
        }
    },
    methods: {
        // 刷新二级评论列表地址
        refreshSubURL() {
            this.subRemote = process.env.ROOT_API + 'comments/getCommentByCommentID.do?random=' + Math.random()
        },
        showReplyEmoji(index) {
            this.showSubEmoji = !this.showSubEmoji
            this.$refs['replyEditor' + this.CommentIndex].quill.focus()
        },
        editorOpts(index) {
            return {
                placeholder: "请编辑回复内容",
                modules:{
                    toolbar: '#toolbar-' + index
                }
            }
        },
        onEditorBlur(val) {
            // console.log('失去了焦点')
        },
        onEditorChange({ editor, html, text }) {
            // console.log('editor changed')
        },
        // 选择表情
        subSelectEmoji(code) {
            // 插入表情
            let reg = /^<p>|<\/p>$/;
            let replyEditorHook = 'replyEditor' + this.CommentIndex
            let quill = this.$refs[replyEditorHook].quill,
                range = quill.getSelection();
            if(this.commentCon[this.CommentIndex]) {
                this.commentCon[this.CommentIndex] = this.commentCon[this.CommentIndex].replace(reg, '') + this.$AngusVueEmoji(code)
            }
            else {
                this.commentCon[this.CommentIndex] = this.$AngusVueEmoji(code)
            }
            this.showSubEmoji = false
            // console.log(range)
            setTimeout(function() {
                quill.setSelection(range.index + 1);
                // console.log("完成");
            }, 100)
        },
        // 请求二级评论列表
        showSubCommentsList(commentid) {
            this.commentID = commentid
            this.subRemote = process.env.ROOT_API + 'comments/getCommentByCommentID.do?random=' + Math.random()
            if (this.subreceiveShowIndex === commentid) {
                this.subreceiveShowIndex = -1
            }
            else {
                this.subreceiveShowIndex = commentid
            }
        },
        // 是否展示回复框
        showSubReveicer(commentid, index) {
            this.CommentIndex = index // 将该评论项的索引存起来
            // this.$refs['replyEditor' + index].quill.focus()
            if (this.receiveShowIndex === commentid) {
                this.receiveShowIndex = -1
            }
            else {
                this.receiveShowIndex = commentid
                // this.$refs['replyEditor' + index].quill.focus()
            }
            this.$refs.replyEditor0.quill.focus()
        },
        // 点赞
        giveUp: function(value) {
            let url = process.env.ROOT_API + 'comments/addPraiseCount.do',
                param = {
                    objid: value
                },
                success = (data) => {
                    // 刷新
                    this.$emit('refreshURL')
                    // this.loadingFlag = false
                },
                error = () => {
                    console.log('点赞失败')
                }
            this.sendPost({url, param, success, error})
        },
        // 回复一级评论 commentid:一级评论ID
        reply: function(commentid) {
            if (this.commentCon[this.CommentIndex] !== '') {
                let url = process.env.ROOT_API + 'comments/receiveComments.do',
                    param = {
                        articleID: this.$route.query.id,
                        commentsID: commentid,
                        content: this.commentCon[this.CommentIndex]
                    },
                    success = () => {
                        this.commentCon[this.CommentIndex] = ''
                        this.receiveShowIndex = -1
                        this.$emit('refreshURL')
                        // this.subreceiveShowIndex = commentid // 展开二级评论列表
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
.submit {
    background: #f1f1eb;
    color: #666;
    border: none;
}
.icon-face {
    color: red !important;
    background: red !important;
}
.article-comment-list div:first-child {
    overflow: visible !important;
}
</style>

<style scoped>
@import '../../assets/css/emoji.css';
ul,
li {
    list-style: none;
}
.content-wrapper-th img {
    /* display: block !important; */
    max-width: 100% !important;
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
