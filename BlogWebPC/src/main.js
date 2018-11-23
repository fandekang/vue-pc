// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex';
import App from './App';
import router from './router';
import ElementUI from "element-ui";
import ElementFrameWork from "../Element-Framework";
import "element-ui/lib/theme-chalk/index.css";
import resource from 'vue-resource';
import loadData from '@assets/js/loadData';
import moduleHead from '@assets/js/ModuleHead';
import moduleMenu from '@assets/js/ModuleMenu';

import './assets/css/iconfont.css'
import angusVueEmoji from 'angus-vue-emoji';

Vue.config.productionTip = false;

Vue.use(angusVueEmoji);
Vue.use(ElementUI);
Vue.use(ElementFrameWork);

Vue.use(resource);
Vue.use(Vuex);

/* eslint-disable no-new */
const
    store = new Vuex.Store({
        modules: {
            moduleHead,
            moduleMenu
        }
    }),
    vm = new Vue({
        el: '#app',
        store,
        mixins: [loadData],
        router,
        components: { App },
        template: '<App/>'
    }),
    whitePageList = ["/Blog", "/"];

router.beforeEach((to, from, next) => {
    let allow = false;

    for (let i = 0, len = whitePageList ? whitePageList.length : 0; i < len; i++) {
        let whitePage = whitePageList[i];
        if(whitePage === to.path) {
            allow = true;
            break;
        }
    }

    if(allow) {
        next();
    }
    else {
        vm.sendGet({
            url : process.env.ROOT_API + "main/checkLogin.do",
            success() {
                next();
            },
            reject(response) {
                console.log('====================================')
                console.log(response)
                if (response.status === 604) {
                    console.log("您还未登陆或者已经登陆超时")
                    vm.$message.error("您还未登陆或者已经登陆超时");
                    store.commit("toggleLoginDialog", {visible: true});
                    next({path: from.path, query: from.query});
                }
                else {
                    vm.$message.error("跳转失败，调取远程数据出错，状态：" + response.status);
                    next({path: from.path, query: from.query});
                }
            }
        });
    }
})
