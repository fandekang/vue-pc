<template>
    <div class="main">
        <el-form :model="form" ref="form" :rules="rules" label-width="80px">
            <el-form-item label="头像">
                <el-upload
                    class="avatar-uploader"
                    action="#"
                    :show-file-list="false"
                    :on-change="changeUploadEvent"
                    :auto-upload="false">
                    <img v-if="this.imageUrl" :src="this.imageUrl" class="avatar">
                    <i v-else class="el-icon-plus
                    avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="真实姓名" prop="staffName">
                <el-input v-model="form.staffName"></el-input>
            </el-form-item>
            <el-form-item label="性别">
                <el-radio-group v-model="form.sex">
                    <el-radio label="男"></el-radio>
                    <el-radio label="女"></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="账号" prop="loginName">
                <el-input disabled v-model="form.loginName"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="passWord">
                <el-input type="password" v-model="form.passWord" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
                <el-input type="password" v-model="form.checkPass" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitEvent">确定</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script type="text/javascript">

    import loadData from '@assets/js/loadData.js';
    import {form} from '@assets/js/global';

    export default {
        name: 'Settings',
        mixins: [loadData, form],
        data() {
            let passValidator = (rule, value, callback) => {
                if (!value) {
                    callback(new Error("请再次确认密码"));
                }
                else if (value !== this.form.passWord) {
                    callback(new Error("两次密码输入不一致"));
                }
                else {
                    callback();
                }
            };
            return {
                formData: new window.FormData(),
                imageUrl: process.env.ROOT_API + 'main/getStaffImg.do?dt=' + Math.random(),
                form: {
                    passWord: '',
                    checkPass: '',
                    loginName: '',
                    staffName: '',
                    sex: ''
                },
                rules: {
                    staffName: [{
                        required: true, message: "姓名不能为空", trigger: "blur"
                    }],
                    passWord: [{
                        required: true, message: "密码不能为空", trigger: "blur"
                    }],
                    checkPass: [{
                        required: true, validator: passValidator, trigger: "blur"
                    }]
                }
            }
        },
        mounted() {
            let url = process.env.ROOT_API + 'main/getCurStaffForSetting.do?dt=' + Math.random(),
                success = (response) => {
                    let body = JSON.parse(response.bodyText);
                    Object.assign(this.form, body.data);
                    this.form.checkPass = body.data.passWord;
                };
            this.sendPost({url, success});
        },
        methods: {
            submitEvent() {
                this.submitForm("form", () => {
                    let staffName = this.form.staffName,
                        url = process.env.ROOT_API + 'main/editSettings.do',
                        success = () => {
                            this.$store.commit("toggleRegDialog", {visible: false});
                            this.$store.dispatch("loginAction", {
                                staffName: staffName,
                                staffImgUrl: process.env.ROOT_API + 'main/getStaffImg.do?dt=' + Math.random()
                            });
                            this.$message.success("设置成功");
                        }

                    this.formData.set('sex', this.form.sex);
                    this.formData.set('loginName', this.form.loginName);
                    this.formData.set('passWord', this.form.passWord);
                    this.formData.set('staffName', staffName);

                    if(this.formData.get("photo")) {
                        this.photoValidator(this.formData.get("photo"), function() {
                            this.sendPost({url, param: this.formData, success});
                        })
                    }
                    else {
                        this.sendPost({url, param: this.formData, success});
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

<style>
    .main {
        margin: 20px 0 0 -20px;
    }

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
        font-size: 18px;
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
