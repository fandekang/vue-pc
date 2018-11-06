export default {
  methods: {
    /***
     * 根据当前页和每页显示个数截取总数据量
     *
     * @param data
     * @param curPage
     * @param pageSize
     * @returns {Blob|ArrayBuffer|Array.<T>|string|*}
     */
    resolvePager(data, curPage, pageSize) {
      const start = (curPage - 1) * pageSize;
      const end = start + pageSize;

      return data.slice(start, end);
    },
    /***
     * 处理当前页发生变化
     *
     * @param curPage
     */
    curChangeHandler(curPage) {
      this.pager.currentPage = curPage;
      //      this.source = this.resolvePager(this.dataJson, curPage, this.pager.pageSize);
      this.loadData();
    },
    // eslint-disable-next-line no-trailing-spaces
    /***
     * 修改每页显示个数的处理器
     * 切换后的当前页数据保留,
     *
     * 例如:
     * 上次显示2条/页,当前页是5,本次切换到5条/页,当前页依旧要保持是5
     * 只是显示的数据是另外一条
     *
     * @param pageSize
     */
    pageSizeChangeHandler(pageSize) {
      this.pager.pageSize = pageSize;
      let pageTotal = this.pager.total / pageSize;

      // eslint-disable-next-line no-trailing-spaces
      // 如果原来的当前页,超出了修改之后的总页数的话,默认显示第一页
      if (this.pager.currentPage > pageTotal) {
        this.pager.currentPage = 1;
      }
      // eslint-disable-next-line indent
//      this.source = this.resolvePager(this.dataJson, curPage, pageSize);
      this.loadData();
    }
  }
};
