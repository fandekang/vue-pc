<template>
    <div class="main" v-loading.lock="loadingFlag">
        <el-row>
            <el-col>
                <h3>{{article.title}}</h3>
            </el-col>
        </el-row>
        <el-row class="title">
            <el-col>
                <span>{{article.createddate}}&nbsp;&nbsp;</span>
                <span>分类: {{article.arttype}}</span>
                <span class="author">&nbsp;作者: {{article.author}}</span>
                <span class="el-icon-document readcount">({{article.readcount}})</span>
            </el-col>
        </el-row>
        <hr>
        <el-row>
            <el-col class="article-content ql-snow">
                <div class="ql-editor">
                    <div ref="articleHeight"></div>
                </div>
                <div v-if="isReadMore" class="readmore-container">
                    <el-button @click="expandAll" class="readmore">阅读更多</el-button>
                </div>
            </el-col>
        </el-row>
                <el-row>
            <el-col class="emoji-wrapper">
                <div id="toolbar" class="editor-title">
                    <b style="float: left">发表评论</b>
                    &nbsp;&nbsp;&nbsp;
                        <i class="iconfont icon-biaoqing" @click="showEmojiBox"></i>
                        <transition name="fade">
                            <div class="emoji-box" v-if="showEmoji">
                                <el-button class="pop-close" :plain="true" type="danger" size="mini" icon="el-icon-close" @click="showEmoji = false">
                                </el-button>
                                <angus-vue-emoji @select="selectEmoji">
                                </angus-vue-emoji>
                            </div>
                        </transition>
                </div>
                <quill-editor class="editor-content"
                v-model="commentContent"
                ref="commentsEditor"
                :rows="3"
                :options="editorOption">
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
        <commentList :remote="remote" :articleID="articleID" @refreshURL="refreshURL"></commentList>
    </div>
</template>

<script>
import loadData from '@assets/js/loadData'
import {quillEditor} from 'vue-quill-editor'
import commentList from '@components/blog/CommentList'

export default {
    components: {quillEditor, commentList},
    name: 'BlogLister',
    mixins: [loadData],
    data() {
        return {
            remote: process.env.ROOT_API + 'comments/getSuperCommentListByArtID.do',
            commentContent: '', // 评论内容
            showEmoji: false,
            articleID: '',
            isReadMore: true,
            loadingFlag: false,
            editorOption:{
                placeholder: "请编辑内容",
                modules:{
                    toolbar: '#toolbar'
                }
            },
            article: {
                title: '',
                readcount: '',
                createddate: '',
                author: '',
                content: ''
            }
        }
    },
    mounted() {
        this.articleContent();
        this.$refs.commentsEditor.quill.focus() // 富文本编辑器获得光标
    },
    watch: {
        article() {
            this.$refs.articleHeight.innerHTML = this.article.content
            if(this.$refs.articleHeight.clientHeight > 500) {
                this.$refs.articleHeight.className = 'content-wrapper-th'
                this.isReadMore = true
            }
            else {
                this.$refs.articleHeight.className = 'content-wrapper-more'
                this.isReadMore = false
            }
        },
        // 监听路由变化
        $route() {
            this.articleID = this.$route.query.id
            this.articleContent()
        }
    },
    methods: {
        // 刷新一级评论列表的地址
        refreshURL() {
            this.remote = process.env.ROOT_API + 'comments/getSuperCommentListByArtID.do?random=' + Math.random()
        },
        expandAll() {
            this.isReadMore = false
            this.$refs.articleHeight.className = 'content-wrapper-more'
        },
        showEmojiBox() {
            this.showEmoji = !this.showEmoji
            this.$refs.commentsEditor.quill.focus()
        },
        // 选择表情框中的表情
        selectEmoji(code) {
            // 插入表情
            let reg = /^<p>|<\/p>$/;
            let quill = this.$refs.commentsEditor.quill,
                range = quill.getSelection();
            if(this.commentContent) {
                this.commentContent = this.commentContent.replace(reg, '') + this.$AngusVueEmoji(code);
            }
            else {
               this.commentContent = this.$AngusVueEmoji(code);
            }
            // console.log(range)
            this.showEmoji = false

            setTimeout(function() {
                quill.setSelection(range.index + 1);
                // console.log("完成");
            }, 100)
        },
        // 提交评论
        onSubmit: function() {
            if (this.commentContent !== '') {
                let url = process.env.ROOT_API + 'comments/releaseComment.do',
                    param = {articleID: this.$route.query.id, content:this.commentContent},
                    success = () => {
                        this.$message.success('发表成功')
                        this.commentContent = ''
                        this.remote = process.env.ROOT_API +
                        'comments/getSuperCommentListByArtID.do?random=' + Math.random()
                    },
                    error = () => {
                        this.$message.error('发表失败')
                    }
                this.sendPost({url, param, success, error})
            }
            else {
                this.$alert('请输入您的评论')
            }
        },
        // 请求文章内容
        articleContent() {
            let _this = this,
                artUrl = process.env.ROOT_API + 'article/getArticleByID.do?objid=' + _this.$route.query.id + '&random=' + Math.random(),
                artSuccess = response => {
                    this.article = JSON.parse(response.bodyText).data
                    this.articleBody = this.article.content
                    setTimeout(() => {
                        _this.loadingFlag = false
                    }, 500)
                }
            this.sendGet({url: artUrl, success: artSuccess})
        }
    }
}
</script>
<style>
.article-content img {
    width: 100% !important;
}

.editor-title {
    background: #f1f1eb;
    border: none !important;
}

.editor-content {
    border: 1px solid #fff5f5;
}

.editor-content .ql-container.ql-snow {
    border: none !important;
}
</style>

<style scoped>
@import '../../assets/css/emoji.css';
h3 {
    font-size: 30px;
}
.main {
    /* margin: 20px 0 0 -20px; */
    width: 780px;
}

.main .readcount, .main .author {
    float: right;
    line-height: 1;
}

.title {
    font-size: 14px;
    color: #aaa;
}

.article-content {
    margin-bottom: 20px;
}

.content-wrapper-th {
    max-height: 500px;
    overflow: hidden;
}

.content-wrapper-more {
    height: auto;
}

.readmore-container {
    position: absolute;
    bottom: 0px;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    height: 150px;
    width: 100%;
    background: linear-gradient(-180deg,rgba(255,255,255,0) 0%,#fff 70%);
}

.readmore-container .readmore {
    height: 40px;
    color: #ca0c16;
    border: 1px solid #ca0c16;
}

.readmore-container .readmore:hover {
    background: #ca0c16;
    color: #fff;
}
</style>
