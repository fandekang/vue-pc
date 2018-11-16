export default {
    state: {
        staffName: "游客",
        artCount: 0,
        original: 0,
        score: 0,
        staffImgUrl: process.env.ROOT_API + 'main/getStaffImg.do?dt=' + Math.random()
    },
    mutations: {
        loginSuccess(state, opt) {
            Object.assign(state, opt);
        },
        logoutSuccess(state) {
            Object.assign(state, {
                staffName: "游客",
                artCount: 0,
                original: 0,
                score: 0,
                staffImgUrl: process.env.ROOT_API + 'main/getStaffImg.do?dt=' + Math.random()
            });
        }
    },
    actions: {
        loginAction({commit, rootState}, opt) {
            commit("loginSuccess", opt);
            rootState.moduleHead.loginBtn = false;
        },
        logoutAction({commit, rootState}) {
            commit("logoutSuccess");
            rootState.moduleHead.loginBtn = true;
        }
    }
};
