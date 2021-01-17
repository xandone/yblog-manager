<template>
    <div id="apk-root">
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
        </div>
        <div class="apk-file"><input type="file"> </div>
        <div class="up-btn">
            <el-button type="primary">上传apk</el-button>
        </div>
        <el-table class="apk-record" :data="apkBeans">
            <el-table-column property="versionCode" label="版本号">
            </el-table-column>
            <el-table-column property="postTime" label="发布时间">
            </el-table-column>
            <el-table-column property="artId" label="下载">
                <template slot-scope="scope">
                    <el-button icon="el-icon-download" type="success" @click='dealComment(scope.$index,scope.row)' circle></el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
export default {

    data() {
        return {
            value1: "",
            value2: "",
            value3: "",
            apkBeans: [],
        }
    },
    created() {
        this.getVersionList();
    },
    methods: {
        getVersionList() {
            this.apkBeans = [{ versionCode: 'v1 .1 .0(3)', postTime: "2021-01-15 23:00:11" }];
        }
    }
}
</script>
<style lang="scss">
#apk-root {
    width: 100%;
    padding: 10px;

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
        padding-top: 10px;
    }

    .apk-record {
        width: 100%;
        margin-top: 20px;
    }
}
</style>