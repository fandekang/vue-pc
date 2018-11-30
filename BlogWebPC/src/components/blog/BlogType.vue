<template>
    <div class="main">
        <panelList-wrapper :data-url="url" :pager='pager' :height="height">
            <panel-wrapper slot-scope='scope' height="160px" headerBgColor='#fff' :bordered='false' :innerBordered='false'>
                <router-link :to="{name:'BlogLister', query:{id:scope.item.articleid}}" class="head" slot='header' v-html='scope.item.title'>
                </router-link>
                <div class='body'  v-html='formatContent(scope.item.content)'></div>
                <div slot='footer' class='footer'>
                    <span class="isoriginal">{{ scope.item.isoriginal ? '原创' : '转载' }}</span>&nbsp;&nbsp;<span>{{ scope.item.pubdate}}</span>&nbsp;&nbsp;
                    <el-button type='text' size='mini'><i class='el-icon-view'></i>阅读</el-button>(<span>{{ scope.item.readcount }}</span>)&nbsp;
                    <el-button type='text' size='mini'><i class='el-icon-tickets'></i>评论</el-button>(<span>{{ scope.item.commentcount }}</span>)
                    <hr>
                </div>
            </panel-wrapper>
        </panelList-wrapper>
    </div>
</template>
<script type="text/javascript">
export default {
  name: "BlogType",
  mounted() {
    let _this = this;
    _this.windowHeight = window.innerHeight;

    window.onresize = () => {
      _this.windowHeight = window.innerHeight;
    };
  },
  watch: {
    windowHeight() {
      this.windowHeight = window.innerHeight;
    }
  },
  data() {
    return {
      windowHeight: 0,
      url:
        process.env.ROOT_API +
        "article/getBlogListByType.do?artType=" +
        this.$route.query.type,
      // url: process.env.ROOT_API + 'article/getMyBlogList.do',
      pager: {
        pageSize: 5,
        pageInt: 1
      }
    };
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
      return this.windowHeight - 205 + "px";
    }
  }
};
</script>

<style scoped>
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
    .panel-wrapper-container {
        overflow: hidden;
    }
</style>
