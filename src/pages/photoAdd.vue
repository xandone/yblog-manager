<template>
    <div id="photo-add">
        <headTop></headTop>
        <div class="cover-img">
            <span class="img-title">新增图片:</span>
            <el-upload action="http://up-z2.qiniup.com" :limit="1" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="handleUpSuccess" :data="qnParam" :before-upload="handleBeforeUp">
                <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="coverImgUrl" alt="">
            </el-dialog>
        </div>
        <div class="pic-list">
            <div class="img-title-div">
                <span class="img-title">图片列表:</span>
            </div>
            <div class="list">
                <el-row v-for="(item ,index) in pics" v-if="index%3==0" class="list-row">
                    <el-col :span="8">
                        <picItem :bean='item'></picItem>
                    </el-col>
                    <el-col :span="8" v-if="index+1<pics.length">
                        <picItem :bean='pics[index+1]'></picItem>
                    </el-col>
                    <el-col :span="8" v-if="index+2<pics.length">
                        <picItem :bean='pics[index+2]'></picItem>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div>
            <el-button style="margin:30px 110px;" type="primary" @click="save()">提交</el-button>
        </div>
    </div>
</template>
<script>
import headTop from '@/components/HeadTop.vue'
import picItem from '@/components/picItem.vue'
import { baseUrl } from '@/config/env'
export default {
    components: {
        headTop,
        picItem
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
            pics: [],
        }
    },
    mounted() {
        this.get_qiniu();
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
            const temp = {};
            temp.url = this.coverImgUrl;
            this.pics.push(temp);
            this.coverImgUrl = "";
        },
        handlePictureCardPreview(file) {
            this.dialogVisible = true;
        },
        handleBeforeUp(file) {
            this.qnParam.key = String(new Date().getTime());
            console.log("this.qnParam.key=" + this.qnParam.key);
        },

        save() {
            console.log(this.pics[0].title);
        }

    }
}
</script>
<style lang="scss">
@import "@/common/base";

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

        .list-row {
            margin-bottom: 20px;
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

            .pic-edit {
                font-size: 14px;
                color: $text_blue;
                margin-top: 2px;
                cursor: pointer;
            }

            .pic-in {
                width: 150px;
            }
        }
    }
}
</style>