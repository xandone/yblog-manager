<template>
    <div class="fillcontain ">
        <headTop></headTop>
        <header class="title">数据统计</header>
        <div class="data-tag-root">
            <el-tag effect="dark" class="d-el-tag" color="#87DE75" style="height: 70px;">
                <div class="data-el-tag">
                    <div class="data-tag">
                        <span>{{typeBeans[0].count}}</span><span>编程</span>
                    </div>
                    <img class="data-tag-icon" src="../assets/code_ic.png" alt="">
                 </div>
            </el-tag>
            <el-tag effect="dark" class="d-el-tag" color="#93B7E3" style="height: 70px;">
                <div class="data-el-tag">
                    <div class="data-tag">
                        <span>{{typeBeans[1].count}}</span><span>杂文</span>
                    </div>
                    <img class="data-tag-icon" src="../assets/essay_ic.png" alt="">
                 </div>
            </el-tag>
            <el-tag effect="dark" class="d-el-tag" color="#A5E7F0" style="height: 70px;">
                <div class="data-el-tag">
                    <div class="data-tag">
                        <span>{{artStatistical.commentCounts}}</span><span>留言</span>
                    </div>
                    <img class="data-tag-icon" src="../assets/comment_ic.png" alt="">
                 </div>
            </el-tag>
        </div>
        <div class="chart-root">
            <ve-line :data="data1"></ve-line>
            <div class="art-chart">
                <ve-histogram :data="data2" class='code-chart' width="80%"></ve-histogram>
                <ve-pie :data="data3" class='code-chart' width="80%"></ve-pie>
            </div>
        </div>
    </div>
</template>
<script>
import headTop from '@/components/HeadTop.vue'
import histogram from 'v-charts/lib/histogram.common'
import pie from 'v-charts/lib/histogram.common'
import line from 'v-charts/lib/histogram.common'
import { mapState } from 'vuex'

export default {
    components: {
        headTop,
    },
    computed: {
        ...mapState([
            'adminId'
        ])
    },
    mounted() {
        this.getFlowData();
    },
    data() {
        return {
            data1: {},
            data2: {},
            data3: {},
            artStatistical: {},
            typeBeans: [],
            artTypeBeans: [],
            yearArtData: [],
        }
    },
    methods: {
        initData(artTypeBeans, yearArtData) {
            this.data1 = {
                columns: ['year', 'code', '杂文'],
                rows: yearArtData
            }

            this.data2 = {
                title: "code数据",
                columns: ['typeName', 'count'],
                rows: artTypeBeans
            }
            this.data3 = {
                columns: ['typeName', 'count'],
                rows: artTypeBeans
            }

        },
        getFlowData() {
            this.$axios.get(`/admin/artInfo`, {
                    params: {
                        adminId: this.adminId
                    }
                })
                .then((response) => {
                    if (response.data.code == 200) {
                        this.artStatistical = response.data.data;
                        // this.typeBeans = [];
                        // this.artTypeBeans = [];
                        this.typeBeans = this.artStatistical.typeBeans;
                        this.artTypeBeans = this.artStatistical.artTypeBeans;
                        this.artTypeBeans.shift();
                        this.yearArtData = [];
                        this.artStatistical.yearArtData.forEach(item => {
                            let temp = {};
                            temp.year = item.year + '年';
                            temp.code = item.codeCount;
                            temp.杂文 = item.essayCount;
                            this.yearArtData.push(temp);
                        })
                        console.log(JSON.stringify(this.yearArtData));
                        this.initData(this.artTypeBeans, this.yearArtData);
                    } else {
                        openToast(response.data.msg);
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
        }
    }
}
</script>
<style lang="scss">
.title {
    margin-top: 20px;
    font-size: 30px;
    color: #333;
    font-weight: bold;
    text-align: center;
}

.data-tag-root {
    margin: 50px;
    text-align: left;
}

.d-el-tag {
    margin-left: 10px;
}

.data-el-tag {
    width: 150px;
    position: relative;

    .data-tag {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        height: 70px;
    }

    .data-tag span {
        color: white;
        font-size: 16px;
        line-height: 20px;
        font-weight: 200;
    }

    .data-tag-icon {
        width: 28px;
        height: 28px;
        position: absolute;
        top: 4px;
        right: 0;
    }
}


.chart-root {
    /*display: flex;*/
    margin-top: 50px;

    .art-chart {
        display: flex;
    }

    .code-chart {}
}
</style>