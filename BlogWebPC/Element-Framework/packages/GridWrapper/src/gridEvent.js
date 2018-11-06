export default {
  methods: {
    /***
     * 事件传递区
     *
     * @param {Array} selection 选中那一行,如果勾选之后再取消,此参数返回空数组
     * @param {Object} row 所在行,不管有没有选中,都返回那一行数据
     * @param {Object} column 信息 eg.
     * 列: {"order":"","id":"el-table_5_column_37","label":"什么时间","property":"date","type":"default","width":150,"isColumnGroup":false,"align":null,"headerAlign":null,"sortable":false,"resizable":true,"showOverflowTooltip":false,"reserveSelection":false,"filterMultiple":true,"filterOpened":false,"filteredValue":[],"filterPlacement":"","minWidth":80,"realWidth":150,"level":1,"colSpan":1,"rowSpan":1}
     *
     * @param {HTMLTableCellElement} cell 单元格dom节点
     * @param {event} event
     */
    select(selection, row) {
      this.$emit("select", selection, row);
    },
    selectAll(selection) {
      this.$emit("select-all", selection);
    },
    selectChange(selection) {
      this.$emit("selection-change", selection);
    },
    cellMouseEnter(row, column, cell, event) {
      this.$emit("cell-mouse-enter", row, column, cell, event);
    },
    cellMouseLeave(row, column, cell, event) {
      this.$emit("cell-mouse-leave", row, column, cell, event);
    },
    cellClick(row, column, cell, event) {
      this.$emit("cell-click", row, column, cell, event);
    },
    cellDblClick(row, column, cell, event) {
      this.$emit("cell-dblclick", row, column, cell, event);
    },
    rowClick(row, event, column) {
      this.$emit("row-click", row, event, column);
    },
    rowContextmenu(row, event) {
      this.$emit("row-contextmenu", row, event);
    },
    rowDblClick(row, event) {
      this.$emit("row-dblclick", row, event);
    },
    headerClick(column, event) {
      this.$emit("header-click", column, event);
    },
    headerContextmenu(column, event) {
      this.$emit("header-contextmenu", column, event);
    },
    sortChange({ column, prop, order }) {
      this.$emit("sort-change", { column, prop, order });
    },
    filterChange(filters) {
      this.$emit("filter-change", filters);
    },
    currentChange(currentRow, oldCurrentRow) {
      this.$emit("current-change", currentRow, oldCurrentRow);
    },
    headerDragend(newWidth, oldWidth, column, event) {
      this.$emit("header-dragend", newWidth, oldWidth, column, event);
    },
    expandChange(row, expandedRows) {
      this.$emit("expand-change", row, expandedRows);
    }
  }
};
