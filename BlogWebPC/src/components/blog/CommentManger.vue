<template>
    <div class="main">
        <commentList-wrapper :data-url="url" :pager='pager'>
            <comment-wrapper slot-scope='scope' height="60px">
                <div slot="img">
                    <img src="@assets/images/timg-2.jpeg">
                </div>
                <div slot="header">
                    <span>{{ scope.item.username}}</span> &nbsp;&nbsp;
                    <span>{{ scope.item.commentdate}}</span>
                </div>
                <div slot="body" v-html='scope.item.commentcontent'></div>
            </comment-wrapper>
        </commentList-wrapper>
    </div>
</template>
<script type="text/javascript">
    export default {
        name: "CommentManger",
        data() {
            return {
                url: process.env.ROOT_API + 'comments/getOwnCommentsList.do',
                pager: {
                    pageSize: 5,
                    pageInt: 1
                },
                item: {
                        commentgood: '6',
                        commentcount: '33'
                }
            }
        },
        methods: {
            deleteRow(index, rows) {
                rows.splice(index, 1);
            }
        }
    }
</script>

<style  scoped>
    .main {
        margin: 20px 0 0 -20px;
    }
    .footer .el-button {
        padding: 0;
        border-color: transparent;
        color: #409eff;
    }
    .footer .el-button:hover {
        color: #66b1ff;
        border-color: transparent;
        background-color: transparent;
    }

</style>
