<!--
    vue模板
    @author: hjj
    @date: 2018/10/23
    @desc:
-->
<template>
    <el-form :model="form" status-icon :rules="rules" ref="form" label-width="70px">
        <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
            <el-input type="password" v-model="form.pass" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="login()">立即登录</el-button>
            <el-button @click="resetForm('form')">重置</el-button>
            <el-button @click="toRegister">前往注册</el-button>
        </el-form-item>
    </el-form>
</template>
<script type="text/javascript">

    import loadData from '@assets/js/loadData';
    import {form} from '@assets/js/global';

    export default {
        name: 'BgLogin',
        mixins: [loadData, form],
        data() {
            return {
                form: {
                    pass: '',
                    username: ''
                },
                rules: {
                    username: [
                        {required: true, message: "请输入用户名", trigger: "blur"}
                    ],
                    pass: [
                        {required: true, message: "请输入密码", trigger: "blur"}
                    ]
                }
            }
        },
        methods: {
            toRegister: function() {
                this.$store.commit("toggleLoginDialog", {visible: false});
                this.$store.commit("toggleRegDialog", {visible: true});
            },
            login() {
                this.submitForm("form", function() {
                    let url = process.env.ROOT_API + 'main/login.do',
                        param = {'username': this.form.username, 'password': this.form.pass},
                        success = (response) => {
                            let body = JSON.parse(response.bodyText);
                            this.$store.commit("toggleLoginDialog", {visible: false});
                            this.$store.dispatch("loginAction", {
                                staffName: body.data.staffName,
                                artCount: body.data.logonOn,
                                original: body.data.staffUUID,
                                score: body.data.isManager,
                                staffImgUrl: process.env.ROOT_API + 'main/getStaffImg.do?dt=' + Math.random()
                            });
                            this.$notify({
                                title: '登陆成功',
                                message: `欢迎回来，${body.data.staffName}`
                            });
                        }
                    this.sendPost({url, param, success})
                });
            }
        }
    }
</script>
