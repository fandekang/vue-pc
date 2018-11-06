export default {
    state: {
        loginDialog: false,
        regDialog: false,
        loginBtn: true
    },
    mutations: {
        toggleLoginDialog(state, opt) {
            state.loginDialog = opt.visible;
        },
        toggleRegDialog(state, opt) {
            state.regDialog = opt.visible;
        }
    }
};
