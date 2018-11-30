import Vue from 'vue'
import resource from 'vue-resource'

export default {
    methods: {
        loadData() {
            if (this.dataUrl) {
                this.remoteData()
            }
            else if (this.dataJson && this.dataJson.length > 0) {
                if (this.pager) {
                    this.source = this.resolvePager(this.dataJson, (this.pager.currentPage || 1), this.pager.pageSize)
                    this.$set(this.pager, 'total', this.dataJson.length)
                }
                else {
                    this.source = this.dataJson
                }
            }
        },
        remoteData() {
            Vue.use(resource)
            let url = this.dataUrl
            let remoteParam = {}

            if (this.pager) {
                remoteParam = {
                    curPage: this.pager.currentPage || 1,
                    pageSize: this.pager.pageSize
                }
            }

            if (this.remoteParam) {
                Object.assign(remoteParam, this.remoteParam);
            }

            this.beforeLoadData()
            const loading = this.$loading({
                lock: true,
                target: this.$el
            })
            this.$http.post(url, remoteParam, {emulateJSON: true}).then(response => {
                // console.log('=======================后台返回的数据')
                // console.log(JSON.parse(response.bodyText))
                const body = JSON.parse(response.bodyText)

                if (body.errorMsg) {
                    this.$message.error(body.errorMsg)
                }
                // 后台菜单返回数据如果没有分页的,直接返回list,如果返回带分页,会返回{list: data, total: count}格式
                else if (body.data && body.data.list) {
                    let arr = []
                    this.source = JSON.parse(response.bodyText).data.list
                    //  向父组件发送当前文章数  @fandekang
                    this.$emit('artLen', this.source.length)
                    this.source.map(v => {
                        arr.push(v.articleid)
                    })
                    this.allArticleID = arr
                }
                else if (body.data) {
                    this.source = JSON.parse(response.bodyText).data
                    this.$emit('panelData', 'this.source')
                }
                if (this.pager && body.data) {
                    this.$set(this.pager, 'total', body.data.total)
                }
                this.loadComplete()
                setTimeout(function() {
                    loading.close();
                }, 500);
            }, response => {
                setTimeout(function() {
                    loading.close();
                }, 500);
                if (response.status === 604) {
                    this.$message.error('您还未登陆或者已经登陆超时')
                    this.$parent.$emit('open-login-dialog')
                }
                else {
                    this.$message.error('调取远程数据失败，状态：' + response.status)
                }
                // this.$message.error("调取远程数据失败: " + JSON.stringify(response));
            })
        },
        beforeLoadData() {},
        loadComplete() {}
    },
    mounted() {
        this.loadData()
    }
}
