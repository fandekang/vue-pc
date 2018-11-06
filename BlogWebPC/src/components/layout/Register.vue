<!--
    vue模板
    @author: hjj
    @date: 2018/10/23
    @desc: 注册
-->
<template>
    <el-form :model="form" status-icon :rules="rules" ref="form" label-width="100px">
        <el-form-item label="头像">
            <el-upload
                class="avatar-uploader"
                action="#"
                :show-file-list="false"
                :on-change="changeUploadEvent"
                :auto-upload="false">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus
                avatar-uploader-icon"></i>
            </el-upload>
        </el-form-item>
        <el-form-item label="账号" prop="loginName">
            <el-input v-model="form.loginName" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="passWord">
            <el-input type="password" v-model="form.passWord" placeholder="请输入密码" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="form.checkPass" placeholder="请再次输入密码" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="staffName">
            <el-input v-model="form.staffName" placeholder="真实姓名，系统会为你保密的"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="register()">立即注册</el-button>
            <el-button @click="resetForm('form')">重置</el-button>
            <el-button @click="toLogin">前往登录</el-button>
        </el-form-item>
    </el-form>
</template>
<script type="text/javascript">

    import loadData from '@assets/js/loadData.js';
    import {form} from '@assets/js/global';

    export default {
        name: 'BgRegister',
        mixins: [loadData, form],
        data() {
            let validatePass2 = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请再次输入密码'))
                }
                else if (value !== this.form.passWord) {
                    callback(new Error('两次输入密码不一致!'))
                }
                else {
                    callback()
                }
            }
            let validateLoginName = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请输入账号'))
                }
                else {
                    let url = process.env.ROOT_API + 'main/validateName.do',
                        param = {'loginName': value},
                        resolve = response => {
                            let body = JSON.parse(response.bodyText)
                            if (body.success) {
                                callback()
                            }
                            else {
                                callback(new Error(body.errorMsg))
                            }
                        }
                    this.sendPost({url, param, resolve})
                }
            }
            return {
                imageUrl: null,
                formData: new window.FormData(),
                form: {
                    passWord: '',
                    checkPass: '',
                    loginName: '',
                    staffName: ''
                },
                rules: {
                    passWord: [{
                        required: true, message: "请输入密码", trigger: 'blur'
                    }],
                    checkPass: [{
                        required: true, validator: validatePass2, trigger: 'blur'
                    }],
                    loginName: [{
                        required: true, validator: validateLoginName, trigger: 'blur'
                    }],
                    staffName: [{
                        required: true, message: "请输入真实姓名", trigger: "blur"
                    }]
                }
            }
        },
        methods: {
            toLogin: function() {
                this.$store.commit("toggleLoginDialog", {visible: true});
                this.$store.commit("toggleRegDialog", {visible: false});
            },
            register() {
                this.submitForm("form", () => {
                    let staffName = this.form.staffName,
                        url = process.env.ROOT_API + 'main/createStaff.do',
                        success = () => {
                            this.$store.commit("toggleRegDialog", {visible: false});
                            this.$store.dispatch("loginAction", {
                                staffName: staffName,
                                artCount: 0,
                                original: 0,
                                score: 0,
                                staffImgUrl: process.env.ROOT_API + 'main/getStaffImg.do?dt=' + Math.random()
                            });
                            this.$notify({
                                title: '注册成功',
                                message: `感谢您的使用，${staffName}`
                            });
                        }

                    this.formData.set('loginName', this.form.loginName);
                    this.formData.set('passWord', this.form.passWord);
                    this.formData.set('staffName', staffName);

                    if(this.formData.get("photo")) {
                        this.photoValidator(this.formData.get("photo"), function() {
                            this.sendPost({url, param: this.formData, success});
                        })
                    }
                    else {
                        this.$message.error("请上传头像照片");
                        return false;
                    }
                });
            },
            changeUploadEvent(file, fileList) {
                this.imageUrl = URL.createObjectURL(file.raw);
                this.formData.set('photo', file.raw);
            }
        }
    }
</script>
<style type="text/css">
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 38px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 78px;
        height: 78px;
        line-height: 78px;
        text-align: center;
    }
    .avatar {
        width: 78px;
        height: 78px;
        display: block;
    }
</style>
