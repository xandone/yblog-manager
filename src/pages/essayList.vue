<template>
    <div class="fillcontain">
        <headTop></headTop>
        <div class="table_container">
            <el-table :data="tableData" highlight-current-row>
                <el-table-column type='expand'>
                    <el-form slot-scope="props" label-position="left" inline class="demo-table-expand">
                        <el-form-item label="作者ID">
                            <span>{{ props.row.essayUserId }}</span>
                        </el-form-item>
                        <el-form-item label="评论数">
                            <span>{{ props.row.essayCommentCount }}</span>
                        </el-form-item>
                        <el-form-item label="浏览量">
                            <span>{{ props.row.essayBrowseCount }}</span>
                        </el-form-item>
                        <el-form-item label="封面图片">
                            <el-image @click='showImg(props.$index,props.row)' style="width: 200px; height: 140px; margin-top:10px;" class="avatar" v-if="props.row.coverImg" :src="props.row.coverImg"></el-image>
                        </el-form-item>
                        <el-form-item label="文章地址">
                            <el-link :href="props.row.artUrl" target='_blank' type="primary">{{ props.row.title }}</el-link>
                        </el-form-item>
                    </el-form>
                </el-table-column>
                <el-table-column type="index">
                </el-table-column>
                <el-table-column property="title" label="标题" width="250">
                </el-table-column>
                <el-table-column property="postTime" label="发布时间" sortable width="200">
                </el-table-column>
                <el-table-column property="essayId" label="文章ID" width="200">
                </el-table-column>
                <el-table-column property="city" label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" @click='dealComment(scope.$index,scope.row)'>评论</el-button>
                        <el-button size="mini" @click='dealEdit(scope.$index,scope.row)' type='warning'>编辑</el-button>
                        <el-button size="mini" @click='dealDelete(scope.$index,scope.row)' type="danger">删除</el-button>
                        <el-switch @change="changeTopping(scope.row)" v-model="tableData[scope.$index].isTopping" active-value='1' inactive-value='0' active-text="置顶" style="margin-left: 10px;">
                        </el-switch>
                    </template>
                </el-table-column>
            </el-table>
            <div class="Pagination" style="text-align: left;margin-top: 10px;">
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="row" layout="total, prev, pager, next" :total="count">
                </el-pagination>
            </div>
            <el-dialog title="预览" :visible.sync="dialogImgVisible" width="50%">
                <el-image style="width: 90%; height: auto; margin-top:10px;" class="avatar" v-if="selectTable.coverImg" :src="selectTable.coverImg"></el-image>
            </el-dialog>
            <el-dialog title="提示" :visible.sync="dialogVisible" width="25%">
                <span>确定删除《{{selectTable.title}}》这个段子吗？</span>
                <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteEssay(selectIndex,selectTable.jokeId)">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog title="评论列表" :visible.sync="dialogCommentVisible" width="60%">
                <comment :jokeId="selectTable.jokeId" :isShowComment='dialogCommentVisible'></comment>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import headTop from '@/components/HeadTop'
import comment from '@/components/comment'
import { mapState } from 'vuex'
import { ESSAY_DETAILS_URL } from '@/config/env.js'

export default {
    components: {
        headTop,
        comment
    },
    computed: {
        ...mapState([
            'adminId'
        ])
    },
    created() {
        this.getJokes();
    },
    data() {
        return {
            tableData: [],
            page: 1,
            row: 10,
            count: 0,
            currentPage: 1,
            dialogVisible: false,
            dialogImgVisible: false,
            dialogCommentVisible: false,
            selectTable: {},
            selectIndex: -1,
        }
    },
    methods: {
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.page = val;
            this.getJokes()
        },
        getJokes() {
            this.$axios.get(`/essay/essaylist`, {
                    params: {
                        page: this.page,
                        row: this.row
                    }
                })
                .then((response) => {
                    const joker = response.data;
                    const data = joker.data;
                    this.count = joker.total;
                    this.tableData = [];
                    data.forEach(item => {
                        const tableData = {};
                        tableData.essayCommentCount = item.essayCommentCount;
                        tableData.essayBrowseCount = item.essayBrowseCount;
                        tableData.content = item.content;
                        tableData.contentHtml = item.contentHtml;
                        tableData.coverImg = JSON.parse(item.coverImg)[0];
                        tableData.essayId = item.essayId;
                        tableData.essayUserId = item.essayUserId;
                        tableData.postTime = item.postTime;
                        tableData.title = item.title;
                        tableData.artUrl = ESSAY_DETAILS_URL + item.essayId;
                        tableData.isTopping = item.isTopping ? "1" : "0";
                        if (item.tags) {
                            tableData.tags = JSON.parse(item.tags);
                        } else {
                            tableData.tags = ['0'];
                        }

                        this.tableData.push(tableData);
                    })
                })
                .catch((error) => {
                    console.log(error);
                });

        },
        showImg(index, row) {
            this.dialogImgVisible = true;
            this.selectTable = row;
        },
        dealComment(index, row) {
            this.dialogCommentVisible = true;
            this.selectTable = row;
            this.selectIndex = index;
        },
        dealEdit(index, row) {
            this.selectTable = row;
            this.selectIndex = index;
            this.$router.push({
                path: '/essayAdd',
                name: 'essayAdd',
                params: {
                    selectBean: JSON.stringify(row)
                }
            });
        },
        dealDelete(index, row) {
            this.dialogVisible = true;
            this.selectTable = row;
            this.selectIndex = index;
        },
        deleteEssay(index, essayId) {
            this.dialogVisible = false
            this.$axios.post(`/admin/joke/delete`, {
                    jokeId: essayId,
                    adminId: this.adminId
                })
                .then((response) => {
                    const result = response.data;
                    if (result && result.code === 200) {
                        this.openSuccess('恭喜，删除成功!');
                        this.tableData.splice(index, 1);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        changeTopping(bean) {
            let essayBean = JSON.stringify({
                isTopping: bean.isTopping === '1',
                essayId: bean.essayId
            });
            let params = this.$qs.stringify({
                adminId: this.adminId,
                jsonEssay: essayBean
            });
            console.log(essayBean);
            this.$axios.post(`/essay/setBanner`, params)
                .then((response) => {
                    const result = response.data;
                    if (result && result.code === 200) {
                        this.openSuccess('恭喜，修改成功!');
                    } else if (result.msg) {
                        this.$message.error(result.msg);
                    } else {
                        this.$message.error('操作失败');
                    }
                })
                .catch((error) => {
                    console.log(error);
                });

        },
        openToast(msg) {
            this.$notify.error({
                title: '错误',
                message: msg
            });
        },
        openSuccess(msg) {
            this.$message({
                message: msg,
                type: 'success'
            });
        },
    }

}
</script>
<style>
.fillcontain {
    height: 100%;
    width: 100%;
}

.demo-table-expand {
    font-size: 0;
}

.demo-table-expand label {
    width: 90px;
    color: #99a9bf;
}

.demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
}


.input-with-select .el-input-group__prepend {
    background-color: #fff;
}

.search-root {
    padding: 20px;
    margin: 20px;
    border-radius: 5px;
    border: 0.5px solid #f0f0f0;
}
</style>