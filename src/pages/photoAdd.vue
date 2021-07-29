<template>
    <div id="photo-add">
        <headTop></headTop>
        <div class="cover-img">
            <span class="img-title">新增图片:</span>
            <el-upload action="http://up-z2.qiniup.com" :limit="piclimit" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="handleUpSuccess" :data="qnParam" :before-upload="handleBeforeUp">
                <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="coverImgUrl" alt="">
            </el-dialog>
                <el-input v-model="picDescrip" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="输入照片描述" maxlength="30" show-word-limit style="margin:10px;width: 50%">
                </el-input>
        </div>
        <div class="pic-list">
            <div class="img-title-div">
                <span class="img-title">图片列表:</span>
            </div>
            <div v-for="(item ,index) in pics" v-if="index%3==0" class="list">
                <el-row>
                    <el-col :span="8">
                        <div class="pic-cover">
                            <img :src="item.url" class="place-img" alt="">
                            <span class="pic-descrip">{{item.title}}</span>
                            <span class="pic-date">{{item.postTime}}</span>
                            <el-popover placement="top" width="160" v-model="pop1">
                                <p>确定删除吗？</p>
                                <div style="text-align: right; margin: 0">
                                    <el-button size="mini" type="text" @click="pop1 = false">取消</el-button>
                                    <el-button type="primary" size="mini" @click="pop1 = false">确定</el-button>
                                </div>
                                <span slot="reference"  class="pic-delete" >删除</span>
                            </el-popover>
                        </div>
                    </el-col>
                    <el-col :span="8" v-if="index+1<pics.length">
                        <div class="pic-cover">
                            <img :src="pics[index+1].url" class="place-img" alt="" >
                            <span class="pic-descrip">{{pics[index+1].title}}</span>
                            <span class="pic-date">{{pics[index+1].postTime}}</span>
                            <el-popover placement="top" width="160" v-model="pop2">
                                <p>确定删除吗？</p>
                                <div style="text-align: right; margin: 0">
                                    <el-button size="mini" type="text" @click="pop2 = false">取消</el-button>
                                    <el-button type="primary" size="mini" @click="pop2 = false">确定</el-button>
                                </div>
                                <span slot="reference"  class="pic-delete" >删除</span>
                            </el-popover>
                        </div>
                    </el-col>
                    <el-col :span="8" v-if="index+2<pics.length">
                        <div class="pic-cover">
                            <img :src="pics[index+2].url" class="place-img" alt="" >
                            <span class="pic-descrip">{{pics[index+2].title}}</span>
                            <span class="pic-date">{{pics[index+2].postTime}}</span>
                            <el-popover placement="top" width="160" v-model="pop3">
                                <p>确定删除吗？</p>
                                <div style="text-align: right; margin: 0">
                                    <el-button size="mini" type="text" @click="pop3 = false">取消</el-button>
                                    <el-button type="primary" size="mini" @click="pop3 = false">确定</el-button>
                                </div>
                                <span slot="reference"  class="pic-delete" >删除</span>
                            </el-popover>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div>
            <el-button style="margin:30px 110px;" type="primary">提交</el-button>
        </div>
    </div>
</template>
<script>
import headTop from '@/components/HeadTop.vue'
export default {
    components: {
        headTop,
    },
    data() {
        return {
            coverImgUrl: '',
            dialogVisible: false,
            qiniu_token: '',
            qnParam: {
                token: "",
                key: ""
            },
            picDescrip: '',
            pop1: false,
            pop2: false,
            pop3: false,
            pics: [{
                    url: "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
                    title: "团长123",
                    postTime: "2014-1-1"
                },
                {
                    url: "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
                    title: "团长",
                    postTime: "2014-1-1"
                },
                {
                    url: "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
                    title: "团长",
                    postTime: "2014-1-1"
                },
            ]
        }
    },
    mounted() {
        // this.get_qiniu();
    },
    methods: {
        get_qiniu() {
            var that = this;
            this.$axios
                .get(baseUrl + '/qiniu/getToken')
                .then((result) => {
                    that.qiniu_token = result.data.msg;
                    that.qnParam.token = that.qiniu_token;
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        handleRemove() {
            this.coverImgUrl = "";
        },

        handleUpSuccess(response) {
            this.coverImgUrl = "http://www.xandone.pub/" + response.key;
        },
        handlePictureCardPreview(file) {
            this.dialogVisible = true;
        },
        handleBeforeUp(file) {
            this.qnParam.key = String(new Date().getTime());
            console.log(this.qnParam.key);
        },

    }
}
</script>
<style lang="scss">
#photo-add {
    position: relative;
    text-align: left;

    .cover-img {
        padding-top: 10px;
        padding-bottom: 10px;
        display: flex;
        align-items: center;
    }

    .img-title {
        width: 100px;
        font-size: 14px;
        font-weight: bold;
        margin-left: 10px;
    }

    .img-title-div {
        width: 100px;
    }

    .pic-list {
        display: flex;

        .list {
            width: 100%;
            margin-left: 20px;
            padding: 16px 10px;
            border: 1px solid #ddd;
        }

        .pic-cover {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            // justify-content: flex-start;

            .place-img {
                width: 150px;
                height: 150px;
                object-fit: contain;
                background: rgba(0, 0, 0, 0.8);
            }

            .pic-descrip {
                // width: 150px;
                font-size: 14px;
                color: #333;
                margin-top: 2px;
            }

            .pic-date {
                // width: 150px;
                font-size: 14px;
                color: #333;
                margin-top: 2px;
            }

            .pic-delete {
                // width: 150px;
                font-size: 14px;
                color: #B63535;
                margin-top: 2px;
                cursor: pointer;
            }
        }
    }
}
</style>