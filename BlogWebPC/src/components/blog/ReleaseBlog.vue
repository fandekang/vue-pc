<template>
  <div class="main">
    <el-form :inline="true">
      <el-form-item label="原创">
        <el-radio-group v-model="isoriginal">
          <el-radio label="是"></el-radio>
          <el-radio label="否"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        文章分类&nbsp;&nbsp;&nbsp;
        <el-select
          v-model="value1"
          clearable
          placeholder="文章分类"
        >
          <el-option
            :label="item.type"
            :value="item.type"
            :key="item.type"
            v-for="item in arttype"
          ></el-option>
        </el-select>
      </el-form-item>
      <span class="title">标题&nbsp;&nbsp;</span>
      <el-form-item>
        <el-input
          v-model="form.title"
          placeholder="文章标题"
          clearable
        ></el-input>
      </el-form-item>
      <span class="title">文章封面&nbsp;&nbsp;</span>
      <el-form-item>
        <el-upload
          class="avatar-uploader"
          :action="articleCover"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
        >
          <img
            v-if="imageUrl"
            :src="imageUrl"
            class="avatar"
          >
          <i
            v-else
            class="el-icon-plus avatar-uploader-icon"
          ></i>
        </el-upload>
      </el-form-item>
    </el-form>
    <quill-editor
      class="quill-editor-content"
      v-model="content"
      ref="myTextEditor"
      :rows="20"
      :content="content"
      :options="editorOption"
    >
    </quill-editor>
    <br />
    <el-button
      type="primary"
      @click="onSubmit"
    >发表博客</el-button>
    <el-button @click="emit">清空</el-button>
  </div>
</template>
<script type="text/javascript">
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import loadData from '@assets/js/loadData'
  import {quillEditor, Quill} from 'vue-quill-editor'
  import {container, ImageExtend, QuillWatch} from 'quill-image-extend-module'

  Quill.register('modules/ImageExtend', ImageExtend)

  export default {
    name: "ReleaseBlog",
    mixins: [loadData],
    components: {quillEditor},
      props: {
          value: {
              type: String
          },
          uploadUrl: {
              type: String
          },
          width: {
              type: Number,
              default: 20
          },
          height: {
              type: Number,
              default: 20
          },
          showMultimedia: {
              type: Boolean,
              default: true
          }
      },
    data() {
      return {
        articleCover: process.env.ROOT_API + "article/uploadFileForEditor.do",
        imageUrl: '',
        form: {
            title: ''
        },
        isoriginal: '',
        arttype: [{type: '科技技术'}, {type: '社会百态'}, {type: '公司建设'}, {type: '国际政要'}],
        value1: '',
        content: '文本编辑器',
        // 富文本框参数设置
        editorOption: {
          placeholder: '请编辑内容...',
          modules: {
            ImageExtend: {
              loading: true,
              name: 'img',
              action: process.env.ROOT_API + "article/uploadFileForEditor.do",
              response: (res) => {
                return res.data
              }
            },
            toolbar: {
              container: container,
              handlers: {
                'image': function() {
                  QuillWatch.emit(this.quill.id)
                }
              }
            }
          }
        }
      }
    },
    mounted() {
       this.content = this.value;
    },
    methods: {
        // 上传封面成功
        handleAvatarSuccess(res, file) {
            this.imageUrl = file.response.data;
        },
        // 对上传到文章封面做限制
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        onSubmit: function() {
            let artType = this.value1;
            let title = this.form.title;
            let content = this.content;
            let isoriginal = this.isoriginal;
            let cover = this.imageUrl
            let obj = {
                "artType": artType,
                "title": title,
                "content": content,
                "isoriginal": isoriginal,
                "cover": cover
            }
            var successCallback = (response) => {
                let id = JSON.parse(response.bodyText).data.articleid
                this.$alert('发表成功', '', {type: 'success'})
                // 改变侧边栏相关的数据
                this.sendGet({
                    url : process.env.ROOT_API + "main/getCurStaff.do",
                    success(response) {
                        let body = response.bodyText && JSON.parse(response.bodyText);
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
                this.$router.push({name: 'BlogLister', query: {id: id}})
            }
            var errorCallback = (response) => {
                console.log('服务器请求出错了')
            }
            this.$http.post(process.env.ROOT_API + 'article/createArticle.do',
            obj, {emulateJSON: true}).then(successCallback, errorCallback);
        },
        emit: function() {
          this.content = '';
        }
    },
    watch: {
        'value'(newVal, oldVal) {
            if (this.editor) {
                if (newVal !== this.content) {
                    this.content = newVal
                }
            }
        }
    }
  }
</script>
<style>
.quill-editor-content .ql-container.ql-snow {
    height: 300px !important;
}
.avatar-uploader .el-upload {
    width: 80px;
    height: 60px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}
.avatar-uploader .el-upload .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 60px;
    line-height: 60px;
    text-align: center;
}
.avatar-uploader .el-upload .avatar {
    width: 80px;
    height: 60px;
    display: block;
}
</style>

<style scoped>
.main {
    margin: 20px 0 0 -20px;
}

.title{
    font-size: 14px;
    position: relative;
    top: 10px;
}
</style>
