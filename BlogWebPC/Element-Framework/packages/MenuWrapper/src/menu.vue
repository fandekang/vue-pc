<template>
  <div :style="{'height': '100%','width': '100%', 'background-color': backgroundColor}">
    <div class="el-title" v-if="mode == 'vertical' && title" :style="{width: '100%', height: titleHeight , color: titleTextColor, 'background-color': titleBgColor}">
      <div class="el-title-inner">
        <span v-html="title"></span>
      </div>
    </div>
    <el-menu :default-active="defaultActive" :mode="mode" :background-color="backgroundColor"
             :text-color="textColor" :active-text-color="activeTextColor" @select="handleSelect"
             :router="router" :menu-trigger="menuTrigger" :default-openeds="defaultOpeneds" :unique-opened="uniqueOpened"
             :collapse="collapse" @open="handleOpen" @close="handleClose"
             >
      <div class="el-title" v-if="mode == 'horizontal' && title" :style="{float: 'left', height: '60px', width: titleWidth, color: titleTextColor, 'background-color': titleBgColor}">
        <div class="el-title-inner">
          <span v-html="title"></span>
        </div>
      </div>
      <template v-for="item in source">
        <el-menu-item v-if="item.children == undefined" :key="item.id" :index="item.id">
          <i :class="item.icon"></i>
          <span>{{item.text}}</span>
        </el-menu-item>
        <template v-else>
          <el-submenu :index="item.id" :key="item.id">
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{item.text}}</span>
            </template>
            <el-menu-item v-for="child in item.children" :key="child.id" :index="child.id">
              <i :class="child.icon"></i>
              <span>{{child.text}}</span>
            </el-menu-item>
          </el-submenu>
        </template>
      </template>
    </el-menu>
  </div>
</template>
<script type="text/javascript">
import loadData from "../../assets/loadData";

export default {
  name: "menu-wrapper",
  mixins: [ loadData ],
  props: {
    title: {
      type: String,
      default: ""
    },
    titleBgColor: {
      type: String,
      default: "#fff"
    },
    titleHeight: {
      type: String,
      default: "80px"
    },
    titleWidth: {
      type: String,
      default: "170px"
    },
    titleTextColor: {
      type: String,
      default: "#303133"
    },
    mode: {
      type: String,
      default: "vertical"
    },
    defaultActive: {
      type: String,
      default: ""
    },
    defaultOpeneds: Array,
    uniqueOpened: Boolean,
    router: Boolean,
    menuTrigger: {
      type: String,
      default: "hover"
    },
    collapse: Boolean,
    backgroundColor: String,
    textColor: String,
    activeTextColor: String,
    dataUrl: String,
    dataJson: Array
  },
  data() {
    return {
      source: []
    };
  },
  methods: {
    handleSelect() {
      this.$emit("select");
    },
    handleOpen(index) {
      this.$emit("open");
    },
    handleClose(index) {
      this.$emit("close");
    }
  }
};
</script>
<style>
  .el-menu {
    border-right: none;
  }
  .el-title {
    overflow: hidden;
    display: table;
    margin:0 auto;
    position:relative;
  }
  .el-title-inner {
    display: table-cell;
    vertical-align:middle;
    text-align:center;
    width:100%;
    height: 100%;
    *position:absolute;
    *top:50%;
    *left:50%;
  }
  .el-title-inner span {
    *position:relative;
    *top:-50%;
    *left:-50%;
  }
</style>
