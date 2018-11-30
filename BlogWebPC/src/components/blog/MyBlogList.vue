<template>
    <div class="main">
        <!-- <div class="edit-wrapper">
            <div>
                <el-checkbox v-show="checkedItems" v-model="checkAll"  ></el-checkbox>
                <span class="delete-items" v-show="checkedItems" @click="alert(1)">删除选中项</span>
            </div>
            <el-button class="bulk-edit" @click="checkedItems = !checkedItems">批量编辑</el-button>
        </div> -->

        <panelList-wrapper @panelData="getPanelData" class="fandekang" :data-url="url" :pager='pager' :height="height" :checkall="checkAll" @checkAll="getCheckAll">
                <panel-wrapper slot-scope='scope' height="160px" headerBgColor='#fff' :bordered='false' :innerBordered='false'>
                    <el-checkbox class="checkedItem" v-show="checkedItems" :label="scope.item.articleid"></el-checkbox>
                    <router-link :to="{name:'MyBlogEdit', params:{id:scope.item.articleid}}" class="header"
                    :class="[checkedItems ? ' magin-left-30' : '']" slot='header' v-html='scope.item.title'>
                    </router-link>
                    <div class='body' v-html='formatContent(scope.item.content)'></div>
                    <div slot='footer' class='footer'>
                        <span>{{ scope.item.isoriginal ? '原创' : '转载' }}</span>&nbsp;&nbsp;<span>{{ scope.item.createddate}}</span>&nbsp;&nbsp;
                        <el-button type='text' size='mini'><i class='el-icon-view'></i>阅读</el-button>
                        (<span>{{ scope.item.readcount }}</span>)&nbsp;
                        <el-button type='text' size='mini'><i class='el-icon-tickets'></i>评论</el-button>
                        (<span>{{ scope.item.commentcount }}</span>)
                        <el-button class="footer-delete" @click="deleteMyBlog(scope.item.articleid)">删除</el-button>
                    </div>
                </panel-wrapper>
        </panelList-wrapper>
    </div>
</template>
<script type="text/javascript">
import loadData from '@assets/js/loadData'
export default {
  name: "MyBlogList",
  mixins: [loadData],
  data() {
    return {
      checkedArticles: [],
      checkAll: false,
      isIndeterminate: true,
      checkedItems: false,
      windowHeight: 0,
      url: process.env.ROOT_API + "article/getMyBlogList.do",
      pager: {
        pageSize: 5,
        pageInt: 1
      }
    };
  },
  mounted() {
    this.windowHeight = window.innerHeight;
    window.onresize = () => {
      this.windowHeight = window.innerHeight;
    }
  },
  watch: {
    windowHeight() {
      this.windowHeight = window.innerHeight;
    }
  },
  computed: {
    height() {
      return this.windowHeight - 205 + "px";
    }
  },
  methods: {
    deleteMyBlog(articleid) {
        this.$confirm('确定删除改文章吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            let url = process.env.ROOT_API + 'article/deleteArticleByID.do',
                param = { articleID: articleid },
                success = (res) => {
                    this.$message.success('删除成功')
                    this.sendGet({
                        url : process.env.ROOT_API + "main/getCurStaff.do",
                        success(response) {
                            let body = response.bodyText && JSON.parse(response.bodyText);
                            // console.log('侧边栏信息')
                            // console.log(body)
                            if (body && body.data) {
                                this.$store.dispatch("loginAction", {
                                    staffName: body.data.staffName,
                                    artCount: body.data.logonOn,
                                    original: body.data.staffUUID,
                                    score: body.data.isManager
                                });
                            }
                        }
                    })
                    this.url = process.env.ROOT_API + "article/getMyBlogList.do?random=" + Math.random()
                },
                error = () => {
                    this.$message.error('删除失败')
                }
            this.sendPost({url, param, success, error})
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        });
    },
    getCheckAll(val) {
        this.checkAll = val
    },
    handleCheckedChange(val) {
        console.log(val)
    },
    getPanelData(val) {
        console.log('从panelList组建中获得的值')
        console.log(val)
    },
    handleCheckAllChange(val) {
        console.log(val)
    },
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
  }
};
</script>

<style>
/* 去掉复选框后面的文字 */
.el-checkbox__label {
    display: none;
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

<style scoped>
/* .panel-wrapper-container {
    border-bottom: 1px solid #ccc !important;
} */
.main {
    margin: 0;
}
.delete-items {
    margin-left: 20px;
    color: #409EFF;
    cursor: pointer;
}
.checkedItem {
    top: -34px;
    left: -4px;
}
.footer-delete {
    float: right;
    padding: 8px 12px;
    border: none;
    color: red !important;
}
.footer-delete:hover {
    background: transparent;
}
.magin-left-30 {
    margin-left: 30px !important;
}
.edit-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}
.edit-wrapper .bulk-edit {
    float: right;
}
</style>
