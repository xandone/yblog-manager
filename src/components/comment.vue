<template>
  <div>
    <div style="padding: 10px;min-height: 500px">
      <span>{{ comments }}</span>
      <el-table :data="commentData" highlight-current-row>
        <el-table-column type="index" width="100">
        </el-table-column>
        <el-table-column property="commentNick" label="昵称">
        </el-table-column>
        <el-table-column property="commentUserId" label="ID">
        </el-table-column>
        <el-table-column property="commentDate" label="评论时间">
        </el-table-column>
        <el-table-column property="commentDetails" label="内容">
        </el-table-column>
      </el-table>
    </div>
    <div class="Pagination" style="text-align: left;margin-top: 10px;">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="currentPage" :page-size="10" layout="total, prev, pager, next" :total="count">
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    isShowComment: false,
    artId: {type: String},
  },
  computed: {
    comments() {
      if (this.isShowComment) {
        console.log("i111d=" + this.artId);
        this.getJokeComments();
      }
    }
  },
  data() {
    return {
      commentData: [],
      page: 1,
      row: 10,
      count: 0,
      currentPage: 1,
    }
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.page = val;
    },
    getJokeComments() {
      this.$axios.get(`/comment/list`, {
        params: {
          page: this.page,
          row: this.row,
          jokeId: this.artId
        }
      })
          .then((response) => {
            const joker = response.data;
            this.count = joker.total;
            this.commentData = joker.data;
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

  },

}
</script>
<style>
</style>