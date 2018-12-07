<template>
    <div class="main">
        <panelList-wrapper :data-url="url" :pager='pager' :height="height">
            <panel-wrapper class="article-list-item" slot-scope='scope' height="135px" imgWidth="160px" headerBgColor='#fff' :bordered='false' :innerBordered='false'>
                <img v-if="scope.item.cover" :src="scope.item.cover" slot="img">
                <img v-else :src="defaultImg" slot="img">
                <router-link :to="{path:'Blog', query:{id:scope.item.articleid}}"  class="head" slot='header' v-html='scope.item.title'>
                </router-link>
                <div class='body' v-html='formatContent(scope.item.content)'></div>
                <div slot='footer' class='footer'>
                    <span class="isoriginal">{{ scope.item.isoriginal ? '原创' : '转载' }}</span>&nbsp;&nbsp;<span>{{ scope.item.pubdate}}</span>&nbsp;
                    <span class="color-def" style="margin-right: 10px;">发布人:{{scope.item.author}}</span>
                    <span class="color-def">类型: {{scope.item.arttype}}</span>&nbsp;
                    <el-button class="color-def" type='text' size='mini'><i class='el-icon-view'></i>阅读</el-button>(<span>{{ scope.item.readcount }}</span>)&nbsp;
                    <el-button class="color-def" type='text' size='mini'><i class='el-icon-tickets'></i>评论</el-button>(<span>{{ scope.item.commentcount }}</span>)
                </div>
            </panel-wrapper>
        </panelList-wrapper >
    </div>
</template>
<script type="text/javascript">
import defaultImg from '@assets/images/article_default.jpg'
    export default {
        name: "BlogList",
        mounted() {
            let _this = this;
            _this.windowHeight = window.innerHeight;
            window.onresize = () => {
                _this.windowHeight = window.innerHeight;
            }
        },
        watch: {
            windowHeight() {
                this.windowHeight = window.innerHeight;
            }
        },
        data() {
            return {
                defaultImg,
                url: process.env.ROOT_API + 'article/getBlogList.do',
                windowHeight: 0,
                pager: {
                    pageSize: 5,
                    pageInt: 1
                },
                loading: true
            }
        },
        methods: {
            remove2PortBlank(str) {
                return str.replace(/^\s*|\s$/g, "");
            },
            formatContent(content) {
                if (!content) return "";

                content = this.remove2PortBlank(content.trim().replace(/<[^>]*>|/g, ""));

                if (content.length > 200) {
                    return content.substr(0, 200) + "</br>...";
                }
                return content + "</br>...";
            }
        },
        computed: {
            height() {
                return (this.windowHeight - 205) + "px";
            }
        }
    }
</script>

<style scoped>
.panel-wrapper-img-container img {
    border-radius: 6px;
}
.article-list-item {
    margin: 10px 0;
    overflow: visible !important;
}
.color-def {
    font-size: 12px;
    color: #333;
    cursor: default;
}
.color-def:focus, .color-def:hover {
    color: #333;
}
.main {
    margin: 20px 0 0 -20px;
}
.panel-wrapper-header a {
    text-decoration: none;
    font-size: 20px;
    line-height: 38px;
    color: #303133;
}
.panel-wrapper-body {
    font-size: 14px;
    color: #606266;
}
</style>
