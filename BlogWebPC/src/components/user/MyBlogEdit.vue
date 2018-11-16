<template>
    <div class="main">
        <el-form :inline="true">
            <!--<el-form-item>-->
                <!--<el-select  v-model="value1" clearable placeholder="文章分类">-->
                    <!--<el-option :label="item.type" :value="item.type"  :key="item.type" v-for="item in arttype"></el-option>-->
                <!--</el-select>-->
            <!--</el-form-item>-->
            <span class="title">标题&nbsp;&nbsp;&nbsp;</span>
            <el-form-item >
                <el-input class="title_content" v-model="title" placeholder="文章标题" clearable></el-input>
            </el-form-item>
        </el-form>
        <quill-editor  v-model="content"
                       ref="myTextEditor"
                       :content="content"
                       :options = "editorOption"
                       @change="onEditorChange($event)">
            <div v-html="article.content"></div>
        </quill-editor>
        <br/>
        <el-button type="primary" @click="onSubmit">提交</el-button>
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
        name: "MyBlogEdit",
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
                title: '',
                article: '',
                arttype: [],
                isoriginal: '',
                value1: '游戏',
                content: '文本编辑器',
                // 富文本框参数设置
                editorOption: {
                    modules: {
                        ImageExtend: {
                            loading: true,
                            name: 'img',
                            action: process.env.ROOT_API + "editer/uploadFileForEditor.do",
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
                    // console.log(response.data)
                    _this.article = JSON.parse(response.bodyText).data;
                    _this.content = _this.article.content;
                    _this.title = _this.article.title;
                }
                var errorCallback = (response) => {
                    console.log('服务器请求出错了')
                }
                this.$http.get(process.env.ROOT_API + 'article/getObjByID.do?objid=' + this.$route.params.id)
                    .then(successCallback, errorCallback);
            },
            onSubmit: function() {
                var successCallback = (response) => {
                    console.log('服务器请求成功了')
                    // console.log(response.data)
                }
                var errorCallback = (response) => {
                    console.log('服务器请求出错了')
                }
                let title = this.title;
                let content = this.content;
                this.$http.post(process.env.ROOT_API + 'article/updateArticle.do',
                    {"articleid": this.$route.params.id, "title": title, "content": content}, {emulateJSON: true}).then(successCallback, errorCallback);
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
    .title{
        font-size: 14px;
        position: relative;
        top: 10px;
    }
    .title_content{
        width: 500px;
    }
</style>
