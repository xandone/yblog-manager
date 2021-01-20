<template>
    <div id="apk-root" v-loading="loading">
        <headTop></headTop>
        <el-table class="apk-record" :data="apkBeans">
            <el-table-column type="index">
            </el-table-column>
            <el-table-column property="versionName" label="版本号">
            </el-table-column>
            <el-table-column property="versionTip" label="版本说明">
            </el-table-column>
            <el-table-column property="postTime" label="发布时间">
            </el-table-column>
            <el-table-column property="apkId" label="下载">
                <template slot-scope="scope">
                    <el-button v-if="scope.$index==0" icon="el-icon-download" type="success" @click='loadApk()' circle></el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="publish-apk">
            <div style="width: 50%">
                <div class="apk-info">
                    <span>版本code：</span>
                    <el-input v-model="value1" placeholder="请输入版本code"></el-input>
                </div>
                <div class="apk-info">
                    <span>版本号：</span>
                    <el-input v-model="value2" placeholder="请输入版本号"></el-input>
                </div>
                <div class="apk-info">
                    <span>版本更新说明：</span>
                    <el-input v-model="value3" type="textarea" :autosize="{ minRows: 5, maxRows: 8}" placeholder="请输入更新日志.."></el-input>
                </div>
                <div class="apk-info" style="margin: 20px 0;">
                    <span>强制更新：</span>
                    <el-switch v-model="isForce" active-value="1" inactive-value="0">
                    </el-switch>
                </div>
            </div>
            <div class="apk-file"><input type="file" @change="changeFile($event)"> </div>
            <div class="up-btn">
                <el-button type="primary" @click="uploadApk()">上传apk</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import headTop from '@/components/HeadTop'
import { mapState } from 'vuex'
import { APK_DOWNLOAD_URL } from '@/config/env'
export default {
    components: {
        headTop
    },

    data() {
        return {
            value1: "",
            value2: "",
            value3: "",
            apkBeans: [],
            file: null,
            loading: false,
            isForce: '0'
        }
    },
    computed: {
        ...mapState([
            'adminId'
        ])
    },
    created() {
        this.getApkList();
    },
    methods: {
        uploadApk() {
            const data = new FormData();
            data.append('codeName', this.value1);
            data.append('versionName', this.value2);
            data.append('versionTip', this.value3);
            data.append('isForce', this.isForce);
            data.append('adminId', this.adminId);
            data.append('apkfile', this.file);
            this.loading = true;
            this.$axios.post(`/apk/apkupload`, data, {
                    timeout: 60000,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                .then((response) => {
                    const result = response.data;
                    if (result && result.code === 200) {
                        this.openSuccess('保存成功!');
                    } else {
                        this.openToast('保存失败，服务器异常');
                    }
                    this.loading = false;
                })
                .catch((error) => {
                    console.log(error);
                    this.loading = false;
                });

        },
        loadApk() {
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = APK_DOWNLOAD_URL
            // link.setAttribute('download', 'excel.xlsx')
            document.body.appendChild(link)
            link.click()
        },
        changeFile(e) {
            this.file = e.target.files[0];
        },
        getApkList() {
            this.$axios.get(`/apk/apklist`, {
                    params: {
                        adminId: this.adminId
                    }
                })
                .then((response) => {
                    const data = response.data.data;
                    this.apkBeans = [];
                    data.forEach(item => {
                        item.versionName = "v_" + item.versionName + "(" + item.versionCode + ")"
                        this.apkBeans.push(item);
                    })
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
<style lang="scss">
#apk-root {
    width: 100%;

    .apk-record {
        width: 100%;
    }

    .publish-apk {
        padding: 10px;
    }

    .apk-file {
        margin-top: 10px;
        text-align: left;
    }

    .apk-info {
        text-align: left;

        span {
            line-height: 35px;
        }
    }

    .up-btn {
        text-align: left;
        padding-top: 20px;
    }
}
</style>