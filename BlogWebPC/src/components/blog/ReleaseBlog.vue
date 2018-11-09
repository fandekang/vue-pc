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
            <el-select  v-model="value1" clearable placeholder="文章分类">
                <el-option :label="item.type" :value="item.type"  :key="item.type" v-for="item in arttype"></el-option>
            </el-select>
        </el-form-item>
        <span class="title">标题&nbsp;&nbsp;</span>
        <el-form-item>
             <el-input  v-model="form.title" placeholder="文章标题" clearable></el-input>
        </el-form-item>
    </el-form>
    <quill-editor v-model="content"
                 ref="myTextEditor"
                   :rows="20"
                :content="content"
                :options = "editorOption"
                @change="onEditorChange($event)">
  </quill-editor>
    <br/>
    <el-button type="primary" @click="onSubmit">发表博客</el-button>
    <el-button @click="emit">清空</el-button>
</div>
</template>
<script type="text/javascript">
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'

  import {quillEditor, Quill} from 'vue-quill-editor'
  import {container, ImageExtend, QuillWatch} from 'quill-image-extend-module'

  Quill.register('modules/ImageExtend', ImageExtend)

  export default {
    name: "ReleaseBlog",
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
        form: {
            title: ''
        },
        isoriginal: '',
        arttype: [],
        value1: '',
        content: '文本编辑器',
        // 富文本框参数设置
        editorOption: {
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
       this.getAjax();
        this.content = this.value;
    },
    methods: {
      onEditorChange() {
        console.log("内容改变了");
        this.$emit('input', this.content)
       // alert("内容改变了");
      },
        getAjax: function() {
        let _this = this;
        var successCallback = (response) => {
            console.log('服务器请求成功了')
            console.log(response.data)
            _this.arttype = JSON.parse(response.bodyText).data;
        }
        var errorCallback = (response) => {
            console.log('服务器请求出错了')
        }
        this.$http.get(process.env.ROOT_API + 'article/getTypeList.do').then(successCallback, errorCallback);
      },
       onSubmit: function() {
            var successCallback = (response) => {
                console.log('服务器请求成功了')
                console.log(response.data)
                this.$alert('发表成功', '', {type: 'success'})
                let id = JSON.parse(response.bodyText).data.articleid
                console.log('==================' + id)
                this.$router.push({name: 'BlogLister', query: {id: id}})
                // this.$router.go(-1)
            }
            var errorCallback = (response) => {
                console.log('服务器请求出错了')
            }
            let artType = this.value1;
            let title = this.form.title;
            let content = this.content;
            let isoriginal = this.isoriginal;
            let obj = {
                "artType": artType,
                "title": title,
                "content": content,
                "isoriginal": isoriginal
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
  .main {
    margin: 20px 0 0 -20px;
  }
  .ql-editor {
      height: 300px;
  }
  .title{
      font-size: 14px;
      position: relative;
      top: 10px;
  }
</style>
