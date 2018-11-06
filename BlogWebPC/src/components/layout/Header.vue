<template>
  <el-row>
    <el-col :span="10">
      <menu-wrapper :default-active="activeIndex"
                    mode="horizontal"
                    router
                    :data-url = "url">
      </menu-wrapper>
    </el-col>
    <el-col :span="5" :offset="9" class="user">
        <el-button size="small" type="primary" icon="el-icon-info" @click="forwardLogin()" v-if="loginBtnVisible">登录</el-button>
        <el-dialog title="用户名登录" :visible.sync="loginDialogVisible">
            <bg-login></bg-login>
        </el-dialog>
        <el-button size="small" type="default" icon="el-icon-edit" @click="forwardReg()" v-if="loginBtnVisible">注册</el-button>
        <el-dialog title="注册用户" :visible.sync="regDialogVisible">
            <bg-register></bg-register>
        </el-dialog>
        <el-button size="small" type="primary" icon="el-icon-warning" @click="forwardLogout()" v-if="!loginBtnVisible">退出</el-button>
    </el-col>
  </el-row>
</template>

<script type="text/javascript">
    import BgLogin from './Login.vue'
    import BgRegister from './Register.vue'
    import loadData from '@assets/js/loadData';

    export default {
        components: {
            BgRegister,
            BgLogin
        },
        mixins: [loadData],
        name: 'Header',
        inject: ['reload'],
        computed: {
            loginDialogVisible: {
                get() {
                    return this.$store.state.moduleHead.loginDialog;
                },
                set(visible) {
                    this.$store.commit("toggleLoginDialog", {visible: visible});
                }
            },
            regDialogVisible: {
                get() {
                    return this.$store.state.moduleHead.regDialog;
                },
                set(visible) {
                    this.$store.commit("toggleRegDialog", {visible: visible});
                }
            },
            loginBtnVisible() {
                return this.$store.state.moduleHead.loginBtn;
            }
        },
        methods: {
            forwardLogin() {
                this.$store.commit("toggleLoginDialog", {visible: true});
            },
            forwardReg() {
                this.$store.commit("toggleRegDialog", {visible: true});
            },
            forwardLogout() {
                this.$confirm('即将退出登陆, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let url = process.env.ROOT_API + "main/logout.do",
                        success = (resp) => {
                            this.$store.dispatch("logoutAction");
                            this.$notify({
                                title: '感谢您的使用',
                                message: "期待下次的见面"
                            });
                            this.$router.push({name:"BlogList"});
                        }
                    this.sendPost({url, success});
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消退出'
                    });
                });
            }
        },
        data() {
            return {
                url: process.env.ROOT_API + 'menu/getMenu.do?direction=' + 1,
                showMsg: false,
                activeIndex: '/',
                formLabelWidth: '80px'
            }
        }
    }
</script>

<style>
  .el-menu--horizontal>.el-menu-item {
    height: 32px;
    line-height: 32px;
  }
    .user a{
        text-decoration: none;
        padding: 0 10px;
        cursor: pointer;
        color: black;
    }
  .user a:hover {
      color: #409eff;
  }
</style>
