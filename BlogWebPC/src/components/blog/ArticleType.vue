<template>
    <div class="article-type-container" >
        <el-row class="article-type" v-for="item in items" :key="item.type">
            <el-col :span="19" >
                <span>{{item.type}}</span>
            </el-col>
            <el-col :span="5">
                <span class="count">{{item.count}}</span>篇
            </el-col>
        </el-row>
        <br/>
        <hr>
        热门文章
        <hr>
        <ul class="hot-article-wrapper">
            <li class="article-list-item" v-for="host in hostList " :key="host.title">
                <i class="hot-icon iconfont icon-zhishiku-pc-remenwenzhangicon"></i><span class="interEvent" @click="hostEvent(host.articleid)">{{ host.title}}</span>
            </li>
        </ul>
    </div>
</template>

<script type="text/javascript">

  export default {
    name: "ArticleType",
        data() {
      return {
          items: [],
          hostList: []
      }
    },
    mounted() {
      this.getAjax();
      this.LoadHostEvent();
    },
    methods: {
      getAjax: function() {
        let _this = this;
        var successCallback = (response) => {
        //   console.log('服务器请求成功了')
        //   console.log(response.data)
          _this.items = JSON.parse(response.bodyText).data;
        }
        var errorCallback = (response) => {
            // console.log('服务器请求出错了')
        }
        this.$http.get(process.env.ROOT_API + 'article/getArtTypeList.do').then(successCallback, errorCallback);
      },
      LoadHostEvent: function() {
          let _this = this;
          var successCallback = (response) => {
            //   console.log('服务器请求成功了')
            //   console.log(response.data)
              _this.hostList = JSON.parse(response.bodyText).data;
              for (let i = 0; i <= _this.hostList.length; i++) {
                  if (_this.hostList[i] && _this.hostList[i].title.length > 30) {
                      _this.hostList[i].title = _this.hostList[i].title.substr(0, 30);
                  }
              }
          }
          var errorCallback = (response) => {
            //   console.log('服务器请求出错了')
          }
          this.$http.get(process.env.ROOT_API + 'article/getHostArtList.do').then(successCallback, errorCallback);
      },
      // 热门文章跳转
      hostEvent(value) {
          this.$router.push({path: '/Blog', query: {id: value}})
        //   this.$router.push({name: '/Blog', params: {id: value}})
      }
    }
  }
</script>
<style scoped type="text/css" >
.hot-icon {
    margin-right: 10px;
    color: #d81e06;
}
.article-type {
  color: #aaa;
}
.hot-article-wrapper {
    padding: 0;
}
.article-list-item {
    padding: 5px;
    cursor: pointer;
}
.article-type-container {
    font-size: 13px;
    /* color: #aaa; */
}
.el-row {
    padding:5px;
}
</style>
