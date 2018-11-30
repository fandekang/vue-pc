<template>
    <div>
        <panelList-wrapper  :data-url='subRemote' :remoteParam="subRemoteParam" :pager='subPager' >
            <panel-wrapper class="subcomment-container" headerHeight="20px" imgWidth="45px" slot-scope='subScope'  headerBgColor='#fff' :bordered='false' :innerBordered='false'>
                <img :onerror="errorUserImg" slot="img" :style="{height: 'auto'}" :src="root + 'main/getStaffImg.do?staffID=' + subScope.item.userid + '&dt=' + Math.random()">
                <div slot='header' class="head" v-html="subScope.item.username + '&nbsp;&nbsp;' + subScope.item.commentdate"></div>
                <span v-if="subScope.item.replyid" style="color: #409EFF">@{{subScope.item.replyname}}：&nbsp;&nbsp; </span>
                <div class='body' v-html='subScope.item.commentcontent'></div>
                <div slot='footer' class='footer'>
                    <el-button type='text' size='mini'><i class='el-icon-star-off'></i>点赞
                    </el-button>
                    (<span>{{ subScope.item.praisecount }}</span>)&nbsp;
                    <el-button type='text' size='mini' @click="showOtherReveicer(subScope.item.commentid, subScope.index)"><i class='el-icon-edit'></i>回复
                    </el-button>
                    (<span>{{ subScope.item.receivecount }}</span>)
                    <transition name="el-zoom-in-top">
                        <div class="emoji-wrapper" v-show="otherReceiveShowIndex==subScope.item.commentid">
                            <div :id="'toolbar-' + subScope.index" class="editor-title emoji-wrapper ql-toolbar ql-snow" style="line-height: 26px">
                                <b style="float: left">回复</b>
                                &nbsp;&nbsp;&nbsp;
                                    <i class="iconfont icon-biaoqing" @click="showOtherEmojiBox(subScope.index)"></i>
                                    <transition name="fade">
                                        <div class="emoji-box" v-if="showOtherEmoji">
                                            <el-button class="pop-close" :plain="true" type="danger" size="mini" icon="el-icon-close" @click="showOtherEmoji = false">
                                            </el-button>
                                            <angus-vue-emoji @select="subSelectEmoji">
                                            </angus-vue-emoji>
                                        </div>
                                    </transition>
                            </div>
                            <quill-editor class="editor-content"
                            v-model="subCommentCon[subScope.index]"
                            :ref="'subReplyEditor' + subScope.index"
                            :rows="3"
                            :options="editorOpts(subScope.index)">
                            </quill-editor>

                            <div class="emoji-wrapper clearfix">
                                <el-button type="primary" size="small" @click="subReply(subScope.item.fathercommentid, subScope.item.commentid,commentID)" class="submit">回复
                                </el-button>
                            </div>
                        </div>
                    </transition>
                </div>
            </panel-wrapper>
        </panelList-wrapper>
    </div>
</template>
<script>
import loadData from '@assets/js/loadData'
import defaultImg from '@assets/images/pic01.jpg'
import {quillEditor} from 'vue-quill-editor'
export default {
    name: 'SubCommentList',
    mixins: [loadData],
    components: {quillEditor},
    props: {
        subRemote: String,
        commentID: String
    },
    watch: {
        commentID() { // 监听父组件传来的一级评论ID
            this.subRemoteParam.commentID = this.commentID
        }
    },
    data() {
        return {
            subCommentIndex: -1,
            subCommentCon: {},
            subRemoteParam: {
                articleID: this.$route.query.id,
                commentID: ''
            },
            showOtherEmoji: false,
            otherReceiveShowIndex: 0, // 是否展示其它回复框
            errorUserImg: `this.src='${defaultImg}'`,
            root: process.env.ROOT_API,
            subPager: {
                pageSizes: [2, 5],
                pageSize: 2,
                pageInt: 1
            }
        }
    },
    methods: {
        showOtherEmojiBox(index) {
            this.showOtherEmoji = !this.showOtherEmoji
            this.$refs['subReplyEditor' + this.subCommentIndex].quill.focus()
        },
        editorOpts(index) {
            return {
                placeholder: "请编辑回复内容",
                modules:{
                    toolbar: '#toolbar-' + index
                }
            }
        },
        // 回复二级评论以及其他评论
        subReply(commentsID, subCommentsID, commentid) {
            if (this.subCommentCon[this.subCommentIndex] !== '') {
                let url = process.env.ROOT_API + 'comments/receiveSubComments.do',
                    param = {
                        articleID: this.$route.query.id,
                        content: this.subCommentCon[this.subCommentIndex],
                        commentsID: commentsID,
                        subCommentsID: subCommentsID
                    },
                    success = () => {
                        this.$emit('refreshSubURL')
                        this.otherReceiveShowIndex = -1
                    },
                    error = () => {
                        this.$message.error('回复失败')
                    }
                this.sendPost({url, param, success, error})
            }
            else {
                this.$alert('请输入您的评论')
            }
        },
        // 选择表情
        subSelectEmoji(code) {
            // 插入表情
            let reg = /^<p>|<\/p>$/;
            let quill = this.$refs['subReplyEditor' + this.subCommentIndex].quill,
                range = quill.getSelection();
            if(this.subCommentCon[this.subCommentIndex]) {
                this.subCommentCon[this.subCommentIndex] = this.subCommentCon[this.subCommentIndex].replace(reg, '') + this.$AngusVueEmoji(code);
            }
            else {
                 this.subCommentCon[this.subCommentIndex] = this.$AngusVueEmoji(code)
            }

            this.showOtherEmoji = false

            setTimeout(function() {
                quill.setSelection(range.index + 1);
                // console.log("完成");
            }, 100)
        },
        // 是否展示其它回复框
        showOtherReveicer(date, index) {
            this.subCommentIndex = index
            this.$refs['subReplyEditor' + this.subCommentIndex].quill.focus()
            if (this.otherReceiveShowIndex === date) {
                this.otherReceiveShowIndex = -1
            }
            else {
                this.otherReceiveShowIndex = date
            }
        },
        // 点赞
        giveUp: function(value) {
            let url = process.env.ROOT_API + 'comments/addPraiseCount.do',
                param = {
                    objid: value
                },
                success = (data) => {
                    console.log(data)
                    // 评论刷新
                    this.$emit('refreshSubURL')
                },
                error = () => {
                    console.log('点赞失败')
                }
            this.sendPost({url, param, success, error})
        }
    }
}
</script>
<style scoped>
    .emoji-wrapper {
        position: relative;
        margin-top: 20px;
        /* margin-bottom: 10px; */
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

    .subcomment-container {
        height: auto !important;
        overflow: visible !important;
        border-bottom: 1px solid #e4e7ed;
    }

    .subcomment-container .head {
        font-size: 13px;
    }

    .subcomment-container >>> .panel-wrapper-container {
        bottom: auto;
        position: relative;
        left: 0 !important;
        display: inline-block;
        vertical-align: top;
        width: 90%;
    }

    .subcomment-container >>> .panel-wrapper-img-container {
        height: auto !important;
        position: relative;
        display: inline-block;
        vertical-align: top;
    }

    .subcomment-container .panel-wrapper-img-container img {
        height: 45px !important;
        border-radius: 45px;
    }

    .subcomment-container >>> .panel-wrapper-container .panel-wrapper-body {
        top: 0 !important;
        bottom: auto !important;
        position: relative;
    }

    .subcomment-container >>> .panel-wrapper-container .panel-wrapper-footer {
        position: relative;
        top: auto !important;
        bottom: auto !important;
        height: auto !important;
    }
</style>
