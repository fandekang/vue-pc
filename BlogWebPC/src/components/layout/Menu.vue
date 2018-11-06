<template>
  <el-row>
    <el-col :span="24">
      <br/>
        <img width="90%" src="@assets/images/logo.png">
      <br/>
      <br/>
      <el-tabs v-model="activeName">
        <el-tab-pane label="个人资料" name="first">
          <PersonalData></PersonalData>
        </el-tab-pane>
        <el-tab-pane label="文章分类" name="second">
          <ArticleType></ArticleType>
        </el-tab-pane>
      </el-tabs>
      <br/>
      <menu-wrapper router :data-url="url"></menu-wrapper>
    </el-col>
  </el-row>
</template>
<script type="text/javascript">
  import PersonalData from '@components/user/PersonalData';
  import ArticleType from '@components/blog/ArticleType';

  export default {
    name: "Menu",
    components: {PersonalData, ArticleType},
    data() {
      return {
        activeName: "first",
        url: process.env.ROOT_API + 'menu/getMenu.do?direction=' + 2
        // dataJson: [{
        //   "id": "/ReleaseBlog", "text": "写博文", "icon": "el-icon-edit"
        // }, {
        //   "id": "/CommentManger", "text": "评论管理", "icon": "el-icon-message"
        // }, {
        //   "id": "/Settings", "text": "个人设置", "icon": "el-icon-setting"
        // }]
      }
    },
    mounted() {
      // this.getAjax();
    },
    methods: {
        // handleSelect() {
        // },
        //  getAjax: function() {
        //      this.$http.get(process.env.ROOT_API + 'menu/getMenu.do?direction=' + 1);
        //  }
    }
  };
</script>

<style type="text/css">
  .el-menu {
    border-right: none;
  }
</style>
