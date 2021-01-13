<template>
    <div id="log-root">
        <el-date-picker v-model="value1" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
        </el-date-picker>
        <div class="log-content">
            <el-input type="textarea" :rows="2" placeholder="请输入更新日志.." v-model="content" :autosize="{ minRows: 10, maxRows: 10}">
            </el-input>
        </div>
        <el-button @click="addLogs" style="margin-top:10px;" type="primary">确定</el-button>
    </div>
</template>
<script type="text/javascript">
import { mapState } from 'vuex'
export default {
    data() {
        return {
            value1: '',
            content: ''
        }
    },

    computed: {
        ...mapState([
            'adminId'
        ])
    },

    methods: {
        addLogs() {
            this.$axios.post(`/admin/addlog`, 
                this.$qs.stringify({
                        'adminId': this.adminId,
                        'createTime': this.value1,
                        'data': this.content
                    }))
                .then((response) => {
                    const result = response.data;
                    if (result && result.code === 200) {
                        this.openSuccess('保存成功!');
                    } else {
                        this.openToast('保存失败，服务器异常');
                    }
                })
                .catch((error) => {
                    console.log(error);
                });

        }
    }

}
</script>
<style lang="scss">
#log-root {
    text-align: left;
    padding: 50px 10px;

    .log-content {
        margin-top: 10px;
        width: 50%;
    }
}
</style>