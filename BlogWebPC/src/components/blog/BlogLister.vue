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
                <div ref="articleContent" class="qwer ql-editor" :class="[isReadMore ? 'content-wrapper-th' : 'content-wrapper-more']" v-html="article.content"></div>
                <div v-if="isReadMore" class="readmore-container">
                    <el-button @click="isReadMore = false" class="readmore">阅读更多</el-button>
                </div>
            </el-col>
        </el-row>
        <commentList></commentList>
    </div>
</template>

<script>
import loadData from '@assets/js/loadData'
import ElButton from '../../../node_modules/element-ui/packages/button/src/button.vue'
import vueEmoji from '@components/emoji/emoji'
import {quillEditor} from 'vue-quill-editor'
import commentList from '@components/blog/CommentList'

export default {
    components: {ElButton, vueEmoji, quillEditor, commentList},
    name: 'BlogLister',
    mixins: [loadData],
    data() {
        return {
            articleHeight: '',
            isReadMore: true,
            loadingFlag: true,
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
        // let el = document.querySelector('.' + this.$refs.articleContent.className)
        // let height = document.defaultView.getComputedStyle(el).height
        this.$nextTick(() => {
            let height = this.$refs.articleContent.offsetHeight
            console.log('===========================')
            console.log(height)
        })
        this.articleContent();
//            console.log(this.$refs.commentsEditor.quill);
    },
    watch: { // 监听路由变化
        $route() {
            this.remoteParam.articleID = this.$route.query.id
            this.articleContent()
        }
    },
    methods: {
        // 请求文章内容
        articleContent() {
            let _this = this,
                artUrl = process.env.ROOT_API + 'article/getArticleByID.do?objid=' + _this.$route.query.id + '&random=' + Math.random(),
                artSuccess = response => {
                    _this.article = JSON.parse(response.bodyText).data
                    setTimeout(() => {
                        _this.loadingFlag = false
                    }, 500)
                }
            this.sendGet({url: artUrl, success: artSuccess})
        }
    }
}
</script>

<style scoped>
    .main {
        /* margin: 20px 0 0 -20px; */
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

    .article-content {
        position: relative;
        margin-bottom: 20px;
    }

    .content-wrapper-th {
        max-height: 500px;
        overflow: hidden;
    }

    .content-wrapper-more {
        /* max-height: auto; */
        overflow: visible;
    }

    .readmore-container {
        position: absolute;
        bottom: 0px;
        left: 0;
        display: flex;
        justify-content: center;
        height: 50px;
        width: 100%;
        background: linear-gradient(-180deg,rgba(255,255,255,0) 0%,#fff 70%);
    }

    .readmore-container .readmore {
        color: #ca0c16;
        border: 1px solid #ca0c16;
    }

    .readmore-container .readmore:hover {
        background: #ca0c16;
        color: #fff;
    }
</style>
