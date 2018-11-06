<template>
    <div :style="{position: 'relative', overflow: 'auto', height: height, width: width}">
        <div class="panel-wrapper-img-container" v-if="this.$slots.img" :style="{height: height, width: imgWidth}">
            <slot name="img"></slot>
        </div>
        <div class="panel-wrapper-container" :style="{
          left: this.$slots.img ? imgContainerWidth : 0,
          border: bordered && '1px solid #EAEAEA',
          'border-radius': radius && '5px',
          'background-color': backgroundColor
          }" :class="{
              'panel-wrapper-container--shadow': shadow
          }">
        <div v-if="this.$slots.tools" class="panel-wrapper-tools" :style="{
          height: headerHeight
        }">
        <el-button-group>
            <slot name="tools"></slot>
        </el-button-group>
        </div>
        <div class="panel-wrapper-header" :style="{
          height: headerHeight,
          'background-color': headerBgColor,
          'color' : headerTextColor,
          'line-height': headerHeight,
          'border-bottom': innerBordered && '1px solid #EAEAEA'
        }">
            <slot name="header"></slot>
        </div>
        <div class="panel-wrapper-body" :style="{
          top: headerHeight,
          bottom: this.$slots.footer ? footerHeight : 0
        }">
            <slot></slot>
        </div>
        <div v-if="this.$slots.footer" class="panel-wrapper-footer" :style="{
          height: footerHeight,
          'line-height': footerHeight,
          'border-top': innerBordered && '1px solid #EAEAEA'
        }">
            <slot name="footer"></slot>
        </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'panel-wrapper',
        props: {
            height: {
                type: String,
                default: '250px'
            },
            width: {
                type: String,
                default: '100%'
            },
            headerHeight: {
                type: String,
                default: '40px'
            },
            footerHeight: {
                type: String,
                default: '32px'
            },
            imgWidth: {
                type: String,
                default: '200px'
            },
            bordered: {
                type: Boolean,
                default: true
            },
            backgroundColor: {
                type: String,
                default: '#FFFFFF'
            },
            headerBgColor: {
                type: String,
                default: '#F8F8F8'
            },
            headerTextColor: {
                type: String,
                default: '#000'
            },
            radius: {
                type: Boolean,
                default: false
            },
            shadow: {
                type: Boolean,
                default: false
            },
            innerBordered: {
                type: Boolean,
                default: true
            },
            imageUrl: {}
        },
        computed: {
            imgContainerWidth() {
                if (this.$slots.img) {
                    let width = parseInt(this.imgWidth);
                    if (isNaN(width)) {
                        return "0";
                    }
                    return (parseInt(this.imgWidth) + 20) + "px";
                }
                else {
                    return "0";
                }
            }
        }
    }
</script>

<style scoped>
    .panel-wrapper-container > * {
        width: 100%;
        text-align: left;
    }

    .panel-wrapper-container {
        box-sizing: border-box;
        min-height: 100px;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
    }

    .panel-wrapper-img-container img {
        width: 100%;
        height: 100%;
    }

    .panel-wrapper-container.panel-wrapper-container--shadow {
        -moz-box-shadow: 2px 2px 5px #333333;
        -webkit-box-shadow: 2px 2px 5px #333333;
        box-shadow: 2px 2px 5px #333333;
    }

    .panel-wrapper-tools {
        position: absolute;
        right: 5px;
        top: 0;
        width: auto;
    }

    .panel-wrapper-container .panel-wrapper-header {
        padding: 0 5px;
        box-sizing: border-box;
        font-size: 16px;
        font-weight: bold;
    }

    .panel-wrapper-container .panel-wrapper-body {
        position: absolute;
        left: 0;
        padding: 5px;
        box-sizing: border-box;
        font-size: 13px;
        overflow: auto;
    }

    .panel-wrapper-container .panel-wrapper-footer {
        position: absolute;
        bottom: 0;
        left: 0;
        padding-left: 5px;
        padding-right: 5px;
        box-sizing: border-box;
        font-size: 14px;
    }
</style>

<style>
    .panel-wrapper-tools .el-button {
        width: 28px;
        transition: transform .5s;
    }

    .panel-wrapper-tools .el-button:hover {
        transform: scale(1.3, 1.3);
    }
</style>
