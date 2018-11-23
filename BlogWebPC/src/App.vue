<template>
    <el-container>
        <el-aside>
            <Menu></Menu>
        </el-aside>
        <el-main ref="ma">
            <Header></Header>
            <br/>
            <router-view v-if="isRouteralive"></router-view>
        </el-main>
    </el-container>
</template>

<script>
    import Header from '@components/layout/Header'
    import Menu from '@components/layout/Menu'

    export default {
        name: 'App',
        components: {Header, Menu},
        provide() {
            return {
                reload: this.reload
            }
        },
        data() {
            return {
                isRouteralive: true,
                showDialog: false
            }
        },
//        created() {
//            const loading = this.$loading({
//                lock: true
//            });
//            setTimeout(() => {
//                loading.close();
//            }, 2000);
//        },
        methods: {
            reload() {
                this.isRouteralive = false
                this.$nextTick(function() {
                    this.isRouteralive = true
                })
            }
        }
    }
</script>

<style>
/* html, body {
    overflow-y: hidden;
} */
.el-aside {
    position: fixed;
    top: 0;
    left: 0;
    width: 20% !important;
    margin-right: 50px;
    padding: 0 15px;
    overflow: hidden;
}
.el-main {
    margin-left: 300px;
}
* {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
ul,li {
  list-style: none;
}
.el-main {
    overflow: visible;
}
</style>
