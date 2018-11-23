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
                        <el-button type='text' size='mini' @click="showSubReveicer(scope.item.commentid)"><i class='el-icon-edit'></i>回复
                        </el-button>
                        (<span v-if="scope.item.receivecount" @click="showSubCommentsList(scope.item.commentid)"><a href="javascript:;">{{ scope.item.receivecount }}</a></span>
                        <span v-else>0</span>)
                        <transition name="el-zoom-in-top">
                            <div v-show="subreceiveShowIndex==scope.item.commentid">
                                <sub-comment :subRemote="subRemote" :commentID="commentID">
                                </sub-comment>
                            </div>
                        </transition>
                        <transition  name="el-zoom-in-top">
                            <div v-show="receiveShowIndex==scope.item.commentid">
                                <div :id="'toolbar-' + scope.index"  class="ql-toolbar ql-snow" style="line-height: 26px">
                                    <b style="float: left">回复内容</b>
                                    &nbsp;&nbsp;&nbsp;
                                    <button>
                                        <i class="icon iconfont icon-face" @click="showSubEmoji = !showSubEmoji"></i>
                                        <transition name="fade" mode="">
                                            <div class="emoji-box" v-if="showSubEmoji">
                                                <el-button class="pop-close" :plain="true" type="danger" size="mini" icon="el-icon-close" @click="showSubEmoji = false">
                                                </el-button>
                                                <angus-vue-emoji
                                                @select="subSelectEmoji">
                                                </angus-vue-emoji>
                                            </div>
                                        </transition>
                                    </button>
                                </div>
                                <quill-editor :rows="3"
                                v-model="scope.artCon"
                                :options="editorOpts(scope.index)"
                                @blur="onEditorBlur($event)"
                                @change="onEditorChange($event)">
                                </quill-editor>

                                <div class="clearfix">
                                    <el-button type="primary" size="small" @click="reply(scope.item.commentid, scope.artCon)" class="submit">回复
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
        articleID: String
    },
    watch: {
        articleID() {
            this.remoteParam.articleID = this.articleID
        }
    },
    data() {
        return {
            showSubEmoji: false,
            subreceiveShowIndex: 0, // 是否展示二级评论列表
            receiveShowIndex: 0,
            errorUserImg: `this.src='${defaultImg}'`,
            root: process.env.ROOT_API,
            remote: process.env.ROOT_API + 'comments/getSuperCommentListByArtID.do',
            remoteParam: {
                articleID: this.$route.query.id
            },
            subRemote: '',
            commentID: '', // 一级评论ID
            pager: {
                pageSizes: [2, 5],
                pageSize: 5,
                pageInt: 1
            }
        }
    },
    methods: {
        // createArticleCon(val) {
        //     for(let i = 0; i < val; i++) {
        //         this.$set('replyContent' + i, '')
        //     }
        //     console.log(val)
        // },
        editorOpts(index) {
            return {
                placeholder: "请编辑回复内容" + index,
                modules:{
                    toolbar: '#toolbar-' + index
                }
            }
        },
        onEditorBlur(val) {
            console.log('失去了焦点')
        },
        onEditorChange({ editor, html, text }) {
            console.log('editor change!', html)
            // this.replyContent = html
        },
        // 选择子级表情框中的表情
        subSelectEmoji(code) {
            // 插入表情
            // let reg = /^<p>|<\/p>$/;
            let quill = this.$refs.replyEditor.quill,
                range = quill.getSelection();
            console.log('++++++++++++', this.replyContent)
            this.replyContent = this.replyContent + this.$AngusVueEmoji(code);
            console.log('----------------', this.replyContent)
            // this.replyContent = this.replyContent.replace(reg, '') + this.$AngusVueEmoji(code);
            console.log(range)
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
        showSubReveicer(commentid) {
            if (this.receiveShowIndex === commentid) {
                this.receiveShowIndex = -1
            }
            else {
                this.receiveShowIndex = commentid
            }
        },
        // 点赞
        giveUp: function(value) {
            let url = process.env.ROOT_API + 'comments/addPraiseCount.do',
                param = {
                    objid: value
                },
                success = (data) => {
                    // 评论刷新
                    this.remote = process.env.ROOT_API + 'comments/getSuperCommentListByArtID.do?random=' + Math.random()
                    // this.loadingFlag = false
                },
                error = () => {
                    console.log('点赞失败')
                }
            this.sendPost({url, param, success, error})
        },
        // 回复一级评论 commentid:一级评论ID， artCon:回复内容
        reply: function(commentid, artCon) {
            console.log(artCon)
            // if (artCon !== '') {
            //     let url = process.env.ROOT_API + 'comments/receiveComments.do',
            //         param = {
            //             articleID: this.$route.query.id,
            //             commentsID: commentid,
            //             content: artCon
            //         },
            //         success = () => {
            //             this.receiveShowIndex = -1
            //             // this.subreceiveShowIndex = commentid //展开二级评论列表
            //             this.remote =
            //                 process.env.ROOT_API +
            //                 'comments/getSuperCommentListByArtID.do?random=' +
            //                 Math.random()
            //         },
            //         error = () => {
            //             this.$message.error('回复失败')
            //         }
            //     this.sendPost({url, param, success, error})
            // }
            // else {
            //     this.$alert('请输入您的评论')
            // }
        }
    }
}
</script>
<style>
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
