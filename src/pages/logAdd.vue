<template>
    <div id="log-root">
        <headTop />
        <div class="log-admin">
            <div>
                <span class="title-tip">日期</span>
                <el-date-picker v-model="value1" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
                </el-date-picker>
            </div>
            <div class="log-content" v-for="(item, index) in listObj" :key="index">
                <div class="title-tip">
                    <i class="el-icon-paperclip"></i>
                    <span class="item-num">{{index+1}}</span>
                </div>
                <div style="width: 80%">
                    <el-input v-model="item.value" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入更新日志..">
                    </el-input>
                </div>
                <el-button @click="removeListObj(index)" style="margin-left: 10px" icon="el-icon-minus" type="danger" circle size="small" v-if="index!=0"></el-button>
            </div>
            <div style="margin-top: 10px;">
                <el-button @click="addListObjItem" type="primary" icon="el-icon-plus" circle></el-button>
                <el-button @click="addLogs" type="primary" icon="el-icon-check">保存</el-button>
            </div>
        </div>
    </div>
</template>
<script type="text/javascript">
import { mapState } from 'vuex'
import headTop from '@/components/HeadTop'
export default {
    data() {
        return {
            value1: '',
            listObj: [{ value: '' }]
        }
    },

    components: {
        headTop
    },

    computed: {
        ...mapState([
            'adminId'
        ])
    },

    methods: {
        addLogs() {
            let arr = [];
            for (let i = 0; i < this.listObj.length; i++) {
                if (typeof this.listObj[i].value == "undefined" || this.listObj[i].value == null || this.listObj[i].value == "") {
                    break;
                }
                arr[i] = this.listObj[i].value;
            }
            let tipJson = JSON.stringify(arr);

            this.$axios.post(`/admin/addlog`,
                    this.$qs.stringify({
                        'adminId': this.adminId,
                        'createTime': this.value1,
                        'data': tipJson
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

        },
        addListObjItem() {
            this.listObj.push({ value: '' })
        },
        removeListObj(index) {
            this.listObj.splice(index, 1);
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
<style lang="scss">
#log-root {

    .log-admin {
        text-align: left;
        padding: 30px 10px;

        .title-tip {
            width: 50px;
            display: inline-block;
        }

        .log-content {
            margin-top: 10px;
            width: 50%;
            display: flex;
            align-items: center;

            .item-num {
                margin-right: 10px;
            }
        }
    }


}
</style>