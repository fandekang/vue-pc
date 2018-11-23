<template>
    <div>
        <div :style="{height: height ,overflow: 'auto'}">
            <el-checkbox-group v-model="articleIDs" @change="handleCheckedChange">
                <template v-for="(item,index) in source">
                        <slot :item="item" :index="index">
                        </slot>
                        <br :key="index"/>
                </template>
            </el-checkbox-group>
        </div>
        <template v-if="pager">
            <grid-page-wrapper :pager="pager" @curChange="curChangeHandler"
            @pageSizeChange="pageSizeChangeHandler"></grid-page-wrapper>
        </template>
    </div>
</template>

<script>
    import resolvePager from '../../assets/resolvePager'
    import gridPageWrapper from '../../GridWrapper/src/grid-page.vue'
    import loadData from '../../assets/loadData'

    export default {
        name: 'panelList-wrapper',
        components: {gridPageWrapper},
        mixins: [resolvePager, loadData],
        data() {
            return {
                source: [],
                articleIDs: [],
                allArticleID: []
            }
        },
        watch: {
            dataUrl() {
                this.loadData();
            },
            checkall() {
                if(this.checkall) {
                    console.log('---------------true')
                    this.articleIDs = this.allArticleID
                } else {
                    console.log('---------------false')
                    this.articleIDs = []
                }
            }
        },
        props: {
            dataJson: Array,
            dataUrl: String,
            pager: Object,
            height: String,
            remoteParam: Object,
            checkall: Boolean
        },
        methods: {
            handleCheckedChange(val) {
                console.log('选中的有================================')
                // if(val.length != this.allArticleID.length) {
                //     this.$emit('checkAll', false)
                // }
                console.log(val)
            }
        }
    }
</script>
