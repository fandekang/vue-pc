<template>
    <div class="main" v-loading.lock="loadingFlag">
        <el-row>
            <el-col>
                <h3>{{article.title}}</h3>
            </el-col>
        </el-row>
        <el-row class="title">
            <el-col>
                <span>{{article.createddate}}</span>&nbsp;&nbsp;
                分类: <span>{{article.arttype}}</span>
                <span class="el-icon-document readcount">({{article.readcount}})</span>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <hr>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <div v-html="article.content"></div>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <span>网友评论</span>
                <el-input v-model="textarea" type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入评论内容">
                </el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <el-button type="primary" size="small" @click="onSubmit">提交</el-button>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <div>全部评论</div>
                <hr>
            </el-col>
        </el-row>
        <el-row>
            <panelList-wrapper :data-url='remote' :pager='pager' :remoteParam="remoteParam">
                <panel-wrapper headerHeight="20px" imgWidth="45px" slot-scope='scope' class="comment-container" headerBgColor='#fff' :bordered='false' :innerBordered='false'>
                    <img :onerror="errorUserImg" slot="img" :style="{height: 'auto'}" :src="root + 'main/getStaffImg.do?staffID=' + scope.item.userid + '&dt=' + Math.random()">
                    <div slot='header' class="head" v-html="scope.item.username + '&nbsp;&nbsp;' + scope.item.commentdate"></div>
                    <div class='body' v-html='scope.item.commentcontent'></div>
                    <div slot='footer' class='footer'>
                        <el-button type='text' size='mini' @click="giveUp(scope.item.commentid)"><i class='el-icon-star-off'></i>点赞</el-button>(<span>{{ scope.item.praisecount }}</span>)&nbsp;
                        <el-button type='text' size='mini' @click="showSubReveicer(scope.item.commentid)"><i class='el-icon-edit'></i>回复</el-button>(<span @click="showSubCommentsList(scope.item.commentid)"><a href="javascript:;">{{ scope.item.receivecount }}</a></span>)

                        <ul v-if="subData" v-show="subreceiveShowIndex==scope.item.commentid" v-loading.lock="isSubCommentListLoading">
                            <li class="sub-comment-item" v-for="(item, index) in subData" :key="index">
                                <div class="panel-wrapper-img-container"><img class="sub-staff" :onerror="errorUserImg" :src="root + 'main/getStaffImg.do?staffID=' + item.userid + '&dt=' + Math.random()"></div>
                                <div class="panel-wrapper-container">
                                    <div class="head">{{item.username}}&nbsp;&nbsp;{{item.commentdate}}</div>
                                    <div class="body"><span v-if="item.replyid" style="color: #409EFF">@{{item.replyname}}：&nbsp;&nbsp; </span>{{item.commentcontent}}</div>
                                    <div class="footer">
                                        <el-button type='text' size='mini'><i class='el-icon-star-off'>点赞</i></el-button>(<span>{{item.praisecount }}</span>)&nbsp;
                                        <el-button type='text' size='mini' @click="showOtherReveicer(item.commentdate)"><i class='el-icon-edit'></i>回复</el-button>(<span>{{item.receivecount }}</span>)
                                    </div>
                                </div>

                                <transition name="el-zoom-in-top">
                                    <div v-show="otherReceiveShowIndex==item.commentdate">
                                        <el-input v-model="subReceiver" type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入评论内容">
                                        </el-input>
                                        <el-button type="primary" size="mini" @click="subReply(item.fathercommentid, item.commentid,scope.item.commentid)">回复</el-button>
                                    </div>
                                </transition>
                            </li>
                        </ul>

                        <transition name="el-zoom-in-top">
                            <div v-show="receiveShowIndex==scope.item.commentid">
                                <el-input v-model="subReceiver" type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入评论内容">
                                </el-input>
                                <el-button type="primary" size="mini" @click="reply(scope.item.commentid)">回复</el-button>
                            </div>
                        </transition>
                    </div>
                </panel-wrapper>
            </panelList-wrapper>
        </el-row>
    </div>
</template>

<script>
import loadData from "@assets/js/loadData";
import defaultImg from "@assets/images/pic01.jpg";
import ElButton from "../../../node_modules/element-ui/packages/button/src/button.vue";

export default {
  inject: ["reload"],
  components: { ElButton },
  name: "BlogLister",
  mixins: [loadData],
  data() {
    return {
      isSubCommentListLoading: false,
      otherReceiveShowIndex: 0, // 是否展示其它回复框
      subreceiveShowIndex: 0, // 是否展示二级回复框
      receiveShowIndex: 0,
      errorUserImg: `this.src='${defaultImg}'`,
      root: process.env.ROOT_API,
      remote: process.env.ROOT_API + "comments/getSuperCommentListByArtID.do",
      remoteParam: {
        articleID: this.$route.query.id
      },
      subData: [], // 二级评论内容
      commentList: null,
      pager: {
        pageSizes: [2, 5],
        pageSize: 2,
        pageInt: 1
      },
      loadingFlag: true,
      textarea: "",
      subReceiver: "",
      article: {
        title: "",
        readcount: "",
        createddate: "",
        content: ""
      }
    };
  },
  mounted() {
      this.articleContent()
  },
  watch: {
    article() {
        this.articleContent()
    }
  },
  methods: {
    // 请求文章内容
    articleContent() {
        let _this = this,
        artID = this.$route.query.id,
        artUrl = process.env.ROOT_API + "article/getObjByID.do?objid=" + artID,
        artSuccess = response => {
          _this.article = JSON.parse(response.bodyText).data;
          setTimeout(() => {
            _this.loadingFlag = false;
          }, 500);
        };
        this.sendGet({ url: artUrl, success: artSuccess });
    },
    // 请求二级评论列表
    showSubCommentsList(commentid) {
      let url =
          process.env.ROOT_API +
          "comments/getCommentByCommentID.do?random=" +
          Math.random(),
        param = {
          articleID: this.$route.query.id,
          commentID: commentid
        },
        success = res => {
          this.subData = res.body.data;
          setTimeout(() => {
            this.isSubCommentListLoading = false;
          }, 500);
        },
        error = err => {
          console.log(err);
          this.$message.error("请求失败");
        };
      this.isSubCommentListLoading = true;
      this.sendGet({ url, param, success, error });

      if (this.subreceiveShowIndex === commentid) {
        this.subreceiveShowIndex = -1;
      }
      else {
        this.subreceiveShowIndex = commentid;
      }
    },
    // 是否展示其它回复框
    showOtherReveicer(date) {
      if (this.otherReceiveShowIndex === date) {
        this.otherReceiveShowIndex = -1;
      }
      else {
        this.otherReceiveShowIndex = date;
      }
    },
    // 是否展示回复框
    showSubReveicer(commentid) {
      if (this.receiveShowIndex === commentid) {
        this.receiveShowIndex = -1;
      }
      else {
        this.receiveShowIndex = commentid;
      }
    },
    // 发表评论
    onSubmit: function() {
      if (this.textarea !== "") {
        let url = process.env.ROOT_API + "comments/releaseComment.do",
          param = { articleID: this.$route.query.id, content: this.textarea },
          success = () => {
            this.$message.success("发表成功");
            this.textarea = "";
            this.remote =
              process.env.ROOT_API +
              "comments/getSuperCommentListByArtID.do?random=" +
              Math.random();
          },
          error = () => {
            this.$message.error("发表失败");
          };
        this.sendPost({ url, param, success, error });
      }
      else {
        this.$alert("请输入您的评论");
      }
    },
    // 点赞
    giveUp: function(value) {
      this.$http.get(
        process.env.ROOT_API + "comments/addPraiseCount.do?objid=" + value
      );
      this.remote =
        process.env.ROOT_API +
        "comments/getSuperCommentListByArtID.do?random=" +
        Math.random();
    },
    // 回复一级评论
    reply: function(commentid) {
      if (this.subReceiver !== "") {
        let url = process.env.ROOT_API + "comments/receiveComments.do",
          param = {
            articleID: this.$route.query.id,
            commentsID: commentid,
            content: this.subReceiver
          },
          success = () => {
            this.subReceiver = "";
            this.receiveShowIndex = -1;
            this.remote =
              process.env.ROOT_API +
              "comments/getSuperCommentListByArtID.do?random=" +
              Math.random();
          },
          error = () => {
            this.$message.error("回复失败");
          };
        this.sendPost({ url, param, success, error });
      }
      else {
        this.$alert("请输入您的评论");
      }
    },
    // 回复二级评论以及其他评论
    subReply(commentsID, subCommentsID, commentid) {
      if (this.subReceiver !== "") {
        let url = process.env.ROOT_API + "comments/receiveSubComments.do",
          param = {
            articleID: this.$route.query.id,
            content: this.subReceiver,
            commentsID: commentsID,
            subCommentsID: subCommentsID
          },
          success = () => {
            console.log('===============已经评论')
            this.subReceiver = "";
            this.showSubCommentsList(commentsID);
            this.otherReceiveShowIndex = -1;
            this.subreceiveShowIndex = commentid;
          },
          error = () => {
            this.$message.error("回复失败");
          };
        this.sendPost({ url, param, success, error });
      }
      else {
        this.$alert("请输入您的评论");
      }
    }
  }
};
</script>

<style scoped>
ul,
li {
  list-style: none;
}
.sub-comment-item {
  border-top: 1px solid #e4e7ed;
}
.sub-staff {
  width: 45px !important;
}
.sub-header {
  font-size: 12px;
}
.main {
  margin: 20px 0 0 -20px;
  width: 780px;
}
.main .readcount {
  float: right;
}
.title {
  font-size: 15px;
  color: #aaa;
}
/*
        自定义评论面板
    */
.comment-container {
  height: auto !important;
  border-bottom: 1px solid #e4e7ed;
}
.comment-container .head {
  font-size: 13px;
}
.comment-container >>> .panel-wrapper-container {
  bottom: auto;
  position: relative;
  left: 0 !important;
  display: inline-block;
  vertical-align: top;
  width: 90%;
}
.comment-container >>> .panel-wrapper-img-container {
  height: auto !important;
  position: relative;
  display: inline-block;
  vertical-align: top;
}
.comment-container .panel-wrapper-img-container img {
  height: 45px !important;
  border-radius: 45px;
}
.comment-container >>> .panel-wrapper-container .panel-wrapper-body {
  top: 0 !important;
  bottom: auto !important;
  position: relative;
}
.comment-container >>> .panel-wrapper-container .panel-wrapper-footer {
  position: relative;
  top: auto !important;
  bottom: auto !important;
  height: auto !important;
}
</style>
