<template>
  <div>
    <el-table ref="elTable"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :height="height"
      :width="width"
      :data="source"
      :maxHeight="maxHeight"
      :row-class-name="rowClassName"
      :fit="fit"
      :stripe="stripe"
      :border="border"
      :size="size"
      :rowKey="rowKey"
      :context="context"
      :showHeader="showHeader"
      :showSummary="showSummary"
      :sumText="sumText"
      :summaryMethod="summaryMethod"
      :emptyText="emptyText"
      :rowStyle="rowStyle"
      :cellClassName="cellClassName"
      :cellStyle="cellStyle"
      :headerRowClassName="headerRowClassName"
      :headerRowStyle="headerRowStyle"
      :headerCellClassName="headerCellClassName"
      :headerCellStyle="headerCellStyle"
      :highlightCurrentRow="highlightCurrentRow"
      :currentRowKey="currentRowKey"
      :expandRowKeys="expandRowKeys"
      :defaultExpandAll="defaultExpandAll"
      :defaultSort="defaultSort"
      :tooltipEffect="tooltipEffect"
      :spanMethod="spanMethod"
      @select="select" @select-all="selectAll" @selection-change="selectChange" @cell-mouse-enter="cellMouseEnter"
      @cell-mouse-leave="cellMouseLeave" @cell-click="cellClick" @cell-dblclick="cellDblClick"
      @row-click="rowClick" @row-contextmenu="rowContextmenu" @row-dblclick="rowDblClick"
      @header-click="headerClick" @header-contextmenu="headerContextmenu" @sort-change="sortChange"
      @filter-change="filterChange" @current-change="currentChange" @header-dragend="headerDragend"
      @expand-change="expandChange">
      <template v-if="columns">
        <template v-for="(column, index) in columns">
          <template v-if="column.action != undefined">
            <el-table-column :key="index" :prop="column.prop" :label="column.label" :width="column.width" :fixed="column.fixed">
              <template slot-scope="scope">
                <el-button v-for="(button, index) in column.action" :size="button.size" :key="index"
                type="text" @click="button.handler.call(this, scope.row)">{{ button.text }}</el-button>
              </template>
            </el-table-column>
          </template>
          <template v-else-if="column.type == 'selection'">
            <el-table-column :key="index" type="selection" :width="column.width" :fixed="column.fixed"></el-table-column>
          </template>
          <template v-else>
            <el-table-column :key="index" :prop="column.prop" :label="column.label" :width="column.width" :fixed="column.fixed">
            </el-table-column>
          </template>
        </template>
      </template>
      <template v-else>
        <slot></slot>
      </template>
    </el-table>
    <template v-if="pager">
      <grid-page-wrapper :pager="pager" @curChange="curChangeHandler" @pageSizeChange="pageSizeChangeHandler"></grid-page-wrapper>
    </template>
  </div>
</template>

<script>
import gridPageWrapper from "./grid-page";
import gridEvent from "./gridEvent";
import loadData from "../../assets/loadData";
import resolvePager from "../../assets/resolvePager";

export default {
  name: "grid-wrapper",
  components: { gridPageWrapper },
  mixins: [gridEvent, loadData, resolvePager],
  data() {
    return {
      source: [],
      loading: false
    };
  },
  methods: {

    /***
     * 调取 ElementUI 内部方法中间件
     *
     */
    emitMethod() {
      if (!arguments || arguments.length === 0 || Object.prototype.toString.call(arguments[0]) !== "[object String]") {
        throw new Error("参数传递有误");
      }
      const methodName = arguments[0];
      const args = Array.prototype.slice.call(arguments, 1);
      this.$refs.elTable[methodName].apply(this, args);
    },
    beforeLoadData() {
      this.loading = true;
    },
    loadComplete() {
      const vm = this;
      setTimeout(function() { vm.loading = false; }, 500);
    }
  },
  props: {
    columns: Array,

    pager: Object | Boolean,

    dataJson: {
      type: Array,
      default: function() {
        return [];
      }
    },

    dataUrl: String,

    fixed: [String, Boolean],

    size: String,

    width: [String, Number],

    height: [String, Number],

    maxHeight: [String, Number],

    fit: {
      type: Boolean,
      default: true
    },

    stripe: Boolean,

    border: Boolean,

    rowKey: [String, Function],

    context: {},

    showHeader: {
      type: Boolean,
      default: true
    },

    showSummary: Boolean,

    sumText: String,

    summaryMethod: Function,

    rowClassName: [String, Function],

    rowStyle: [Object, Function],

    cellClassName: [String, Function],

    cellStyle: [Object, Function],

    headerRowClassName: [String, Function],

    headerRowStyle: [Object, Function],

    headerCellClassName: [String, Function],

    headerCellStyle: [Object, Function],

    highlightCurrentRow: Boolean,

    currentRowKey: [String, Number],

    emptyText: String,

    expandRowKeys: Array,

    defaultExpandAll: Boolean,

    defaultSort: Object,

    tooltipEffect: String,

    spanMethod: Function
  }
};
</script>
