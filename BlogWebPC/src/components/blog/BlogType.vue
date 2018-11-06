<template>
    <div class="main">
        <panelList-wrapper  :data-url="url" :pager='pager'>
            <panel-wrapper slot-scope='scope' height="200px" headerBgColor='#fff' :bordered='false' :innerBordered='false'>
                <router-link :to="{name:'BlogLister', query:{id:scope.item.articleid}}" class="header" slot='header' v-html='scope.item.title'>
                </router-link>
                <div class='body' v-html='formateContent(scope.item.content)'></div>
                <div slot='footer' class='footer'>
                    <span class="isoriginal">{{ scope.item.isoriginal ? '原创' : '转载' }}</span>&nbsp;&nbsp;<span>{{ scope.item.pubdate}}</span>&nbsp;&nbsp;
                    <el-button type='text' size='mini'><i class='el-icon-view'></i>阅读</el-button>(<span>{{ scope.item.readcount }}</span>)&nbsp;
                    <el-button type='text' size='mini'><i class='el-icon-tickets'></i>评论</el-button>(<span>{{ scope.item.commentcount }}</span>)
                    <hr>
                </div>
            </panel-wrapper>
        </panelList-wrapper >
    </div>
</template>
<script type="text/javascript">
    export default {
        name: "BlogType",
        data() {
            return {
                url: process.env.ROOT_API + 'article/getBlogListByType.do?artType=' + this.$route.query.type,
                // url: process.env.ROOT_API + 'article/getMyBlogList.do',
                pager: {
                    pageSize: 5,
                    pageInt: 1
                }
            }
        },
        methods: {
            formateContent(content) {
                if (content.indexOf("img") > -1) {
                    content = content.replace("img", "span");
                }
                if (content.length > 200) {
                    content = content.substr(0, 200);
                }
                return content;
            }
        }
    }
</script>

<style>
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
        overflow:hidden;
    }
    /*.main .cell .table-column-log {*/
        /*color: #303133;*/
    /*}*/
    /*.main .cell .table-column-read {*/
        /*padding-left: 15px;*/
    /*}*/
    /*.main .cell .table-column-comment {*/
        /*padding-left: 15px;*/
    /*}*/
    /*.isoriginal{*/
        /*font-size:10px;*/
    /*}*/
</style>
