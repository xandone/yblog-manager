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
            <v-chart :options="data1" style="width: 50%;height:450px;" />
            <v-chart :options="data2" />
            <v-chart :options="data3" style="width: 50%;height:450px;" />
        </div>
    </div>
</template>
<script>
import headTop from '@/components/HeadTop.vue'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/polar'
import 'echarts/lib/component/title';
import 'echarts/lib/chart/bar';
import "echarts/lib/chart/pie";
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
            artTypeBeans: []
        }
    },
    methods: {
        initData(artTypeBeans) {
            const typeNames = [];
            const counts = [];
            const pieBeans = [];
            artTypeBeans.forEach(item => {
                let name = item.typeName;
                typeNames.push(name);

                let count = item.count;
                counts.push(count);

                let pie = {
                    value: item.count,
                    name: item.typeName
                }
                pieBeans.push(pie);
            })


            this.data1 = {
                    color: ["#64CDF0", "#F5686F"],
                    title: {
                        text: '数据分布',
                    },
                    xAxis: [{
                        type: "category",
                        data: typeNames,
                        // 修改文本的颜色
                        axisLabel: {
                            color: "#666",
                            fontSize: 12
                        },
                        // 修改轴线的颜色
                        axisLine: {
                            lineStyle: {
                                color: "#999"
                            }
                        }
                    }],
                    yAxis: [{
                        type: "value",
                        axisLabel: {
                            color: "#333",
                            fontSize: 10
                        },
                        // 修改y轴横向分割线的颜色
                        splitLine: {
                            lineStyle: {
                                color: ["#FFC9CB"]
                            }
                        },
                        axisLine: {
                            lineStyle: {
                                color: "#999"
                            }
                        }
                    }],
                    series: [{
                        name: "访问",
                        type: "bar",
                        barWidth: "40%",
                        label: {
                            show: true,
                            position: "top",
                            color: "#666",
                            formatter: "{c}"
                        },
                        data: counts
                    }]
                },
                this.data2 = {
                    title: {
                        text: '数据饼图',
                        x: 'left'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    series: [{
                        name: '访问来源',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        data: pieBeans,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }]
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
                        this.typeBeans = [];
                        this.artTypeBeans = [];
                        this.typeBeans = this.artStatistical.typeBeans;
                        this.artTypeBeans = this.artStatistical.artTypeBeans;
                        this.artTypeBeans.shift();
                        this.initData(this.artTypeBeans);
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
}
</style>