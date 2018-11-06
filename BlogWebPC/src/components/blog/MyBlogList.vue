<template>
    <div class="main">
        <panelList-wrapper :data-url="url" :pager='pager'>
            <panel-wrapper slot-scope='scope' height="200px" headerBgColor='#fff' :bordered='false' :innerBordered='false'>
                <router-link :to="{name:'MyBlogEdit', params:{id:scope.item.articleid}}" class="header" slot='header' v-html='scope.item.title'>
                </router-link>
                <div class='body' v-html='formateContent(scope.item.content)'></div>
                <div slot='footer' class='footer'>
                    <span>{{ scope.item.isoriginal ? '原创' : '转载' }}</span>&nbsp;&nbsp;<span>{{ scope.item.createddate}}</span>&nbsp;&nbsp;
                    <el-button type='text' size='mini'><i class='el-icon-view'></i>阅读</el-button>
                    (<span>{{ scope.item.readcount }}</span>)&nbsp;
                    <el-button type='text' size='mini'><i class='el-icon-tickets'></i>评论</el-button>
                    (<span>{{ scope.item.commentcount }}</span>)
                    <hr>
                </div>
            </panel-wrapper>
        </panelList-wrapper>
    </div>
</template>
<script type="text/javascript">
export default {
    name: "MyBlogList",
    data() {
        return {
            url: process.env.ROOT_API + 'article/getMyBlogList.do',
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
            if (content.length > 300) {
                content = content.substr(0, 300);
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

    .main .cell .table-column-log {
        color: #303133;
    }

    .main .cell .table-column-read {
        padding-left: 15px;
    }

    .main .cell .table-column-comment {
        padding-left: 15px;
    }
</style>
