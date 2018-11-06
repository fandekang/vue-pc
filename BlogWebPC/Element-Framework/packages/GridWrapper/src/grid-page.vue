<template>
  <div>
    <br/>
    <el-pagination
      :background = "pager.background || true"
      :page-sizes="pager.pageSizes || [5, 10, 20, 500]"
      :page-size="pager.pageSize || 10"
      :layout="pager.layout || 'total, sizes, prev, pager, next, jumper'"
      :total="pager.total || 100"
      :current-page="pager.currentPage || 1"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "grid-page-wrapper",
  props: {
    pager: Object | Boolean
  },
  methods: {
    handleCurrentChange(currentPage) {
      this.$emit("curChange", currentPage);
    },
    handleSizeChange(pageSize) {
      this.$emit("pageSizeChange", pageSize);
    }
  }
};
</script>
