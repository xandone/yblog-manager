<template>
    <div class="edit-root">
        <div class="edit-area">
            <div class="title">
                <el-input v-model="title" placeholder="请输入标题" clearable>
                </el-input>
            </div>
            <div id="bar"></div>
            <div class="divide-edit-line"></div>
            <div class="select-type">
                <span>选择类别:</span>
                <div>
                    <el-radio-group v-model="radioType" border size="small">
                        <el-radio-button label="0">编程</el-radio-button>
                        <el-radio-button label="1">Android</el-radio-button>
                        <el-radio-button label="2">Java</el-radio-button>
                        <el-radio-button label="3">前端</el-radio-button>
                        <el-radio-button label="4">设计模式</el-radio-button>
                        <el-radio-button label="5">算法</el-radio-button>
                        <div style="margin-top: 10px">
                            <el-radio-button label="6">Python</el-radio-button>
                            <el-radio-button label="7">Canvas</el-radio-button>
                            <el-radio-button label="8">Game</el-radio-button>
                        </div>
                    </el-radio-group>
                </div>
            </div>
            <div class="cover-img">
                <span>封面图片:</span>
                <el-upload action="http://up-z2.qiniup.com" :limit="piclimit" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="handleUpSuccess" :data="qnParam" :before-upload="handleBeforeUp">
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="coverImgUrl" alt="">
                </el-dialog>
            </div>
            <div class="divide-edit-line"></div>
            <div id="editor"></div>
        </div>
        <div class="preview">
            <span class="title-tip">{{title}}</span>
            <el-button class="commit-btn" @click="addArt" type="primary" icon="el-icon-check" size="mini">保存</el-button>
            <div class="author-tip">
                <span >xandone</span>
                <span >{{currentDate}}</span>
            </div>
            <div class="content-tip" v-html='editorHtml'>
            </div>
        </div>
    </div>
</template>
<script>
import E from 'wangeditor'
import { baseUrl } from '@/config/env'

export default {
    components: {},
    computed: {},
    data() {
        return {
            artId: '',
            title: '',
            editorHtml: '',
            editorText: '',
            editor: '',
            qiniu_token: '',
            qnParam: {
                token: "",
                key: ""
            },
            piclimit: 1,
            coverImgUrl: '',
            dialogVisible: false,
            radioType: "0",
            selectBean: null,
            currentDate: null
        }
    },
    mounted() {
        this.selectBean = this.$route.params.selectBean;
        if (typeof this.selectBean !== 'undefined') {
            this.selectBean = JSON.parse(this.$route.params.selectBean);
            this.currentDate = this.selectBean.postTime;
        } else {
            this.currentDate = new Date().toLocaleString('chinese', { hour12: false });
        }
        // console.log(this.selectBean);
        // 获取七牛
        // this.upload_imgs();
        this.get_qiniu();
        this.fillData();
    },
    watch: {
        '$route': 'getParams'
    },
    methods: {
        getParams() {
            this.get_qiniu();
            if (this.$route.name === 'artAdd' && typeof this.$route.params.selectBean !== 'undefined') {
                this.selectBean = JSON.parse(this.$route.params.selectBean);
                this.currentDate = this.selectBean.postTime;
                this.fillData();
            } else {
                this.currentDate = new Date().toLocaleString('chinese', { hour12: false });
            }
        },
        fillData() {
            if (typeof this.selectBean !== 'undefined' && this.selectBean !== null) {
                this.artId = this.selectBean.artId;
                this.title = this.selectBean.title;
                this.editorHtml = this.selectBean.contentHtml;
                this.editorText = this.selectBean.content;
                this.title = this.selectBean.title;
                this.radioType = this.selectBean.type.toString();
                this.coverImgUrl = this.selectBean.coverImg;
                this.editor.txt.html(this.selectBean.contentHtml);
            }
        },
        getEtHtml() {
            return this.editorHtml;
        },
        getEtText() {
            return this.editorText.replace(/&nbsp;/gi, '');
        },
        getFirstImgSrc(htmlstr) {
            var reg = /<img.+?src=('|")?([^'"]+)('|")?(?:\s+|>)/gim;
            var imgsrcArr = [];
            var tem = [];
            while (tem = reg.exec(htmlstr)) {
                imgsrcArr.push(tem[2]);
            }
            return imgsrcArr[0];
        },
        uploadImg() {
            this.upload_imgs();
        },
        addArt() {
            this.$axios.post(`/art/add`, {
                    artId: this.artId,
                    title: this.title,
                    artUserId: "1",
                    content: this.getEtText(),
                    contentHtml: this.getEtHtml(),
                    type: Number(this.radioType),
                    coverImg: this.coverImgUrl,
                })
                .then((response) => {
                    const result = response.data;
                    if (result && result.code === 200) {
                        // this.resetForm();
                        this.openSuccess('恭喜，发表成功!');
                    } else {
                        this.openToast('发布失败，服务器异常');
                    }
                })
                .catch((error) => {
                    console.log(error);
                });

        },
        upload_imgs: function() {
            this.editor = new E('#bar', '#editor');
            this.editor.customConfig.onchange = (html) => {
                this.editorHtml = html;
                this.editorText = this.editor.txt.text();
            }
            this.editor.customConfig.menus = [
                'head', // 标题
                'bold', // 粗体
                'italic', // 斜体
                'underline', // 下划线
                'strikeThrough', // 删除线
                'foreColor', // 文字颜色
                'backColor', // 背景颜色
                'link', // 插入链接
                'list', // 列表
                'justify', // 对齐方式
                'quote', // 引用
                // 'emoticon',  // 表情
                'image', // 插入图片
                'table', // 表格
                // 'video', // 插入视频
                'code', // 插入代码
                'undo', // 撤销
                'redo' // 重复
            ]
            // 这里用的是七牛华南的服务器
            this.editor.customConfig.uploadImgServer = 'http://up-z2.qiniup.com'
            // 这个地方是禁止网络上传tab
            this.editor.customConfig.showLinkImg = false;
            // 这个地方是显示上传本地图片的tab
            this.editor.customConfig.uploadFileName = 'file'
            // 这里显示的是用户标识token
            this.editor.customConfig.uploadImgParams = { token: this.qiniu_token }
            var that = this;
            this.editor.customConfig.uploadImgHooks = {
                before: function(xhr, editor, files) {
                    // 在这里你可以写一些loading什么之类的
                    console.log('before', xhr, editor, files);
                },
                success: function(xhr, editor, result) {
                    // 在这里你可以写一些上传成功的提示
                },
                fail: function(xhr, editor, result) {
                    // 这里可以写一些上传错误的提示
                },
                error: function(xhr, editor) {
                    // 图片上传出错时触发
                },
                timeout: function(xhr, editor) {
                    // 图片上传超时
                },
                customInsert: function(insertImg, result, editor) {
                    // 这个hash就是我前面说的key值啦
                    var url = "http://www.xandone.pub/" + result.hash;
                    insertImg(url)
                    console.log('customInsert', insertImg, result, editor);
                    // result 必须是一个 JSON 格式字符串！！！否则报错
                }
            }
            this.editor.create();
        },

        get_qiniu() {
            var that = this;
            this.$axios
                .get(baseUrl + '/qiniu/getToken')
                .then((result) => {
                    that.qiniu_token = result.data.msg;
                    that.qnParam.token = that.qiniu_token;
                    if (that.editor != '') {
                        that.editor.destory();
                    }
                    that.upload_imgs();
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
<style lang="scss" scoped>
@import "@/common/base.scss";

.edit-root {
    width: 100%;
    min-height: 100%;
    display: flex;

    img {
        width: 760px;
    }
}

.edit-area {
    width: 50%;
    min-height: 100%;
    padding: 10px;
    display: flex;
    flex-direction: column;

    .title {
        width: 100%;
    }


    #bar {}

    .divide-edit-line {
        height: 1px;
        background-color: #ddd;
    }

    .select-type {
        display: flex;
        margin-top: 10px;
        margin-bottom: 10px;

        span {
            font-size: 14px;
            font-weight: bold;
            margin-right: 10px;
        }
    }

    .cover-img {
        padding-top: 10px;
        padding-bottom: 10px;
        display: flex;
        align-items: center;

        span {
            font-size: 14px;
            font-weight: bold;
            margin-right: 10px;
        }
    }

    #editor {
        height: 100%;
        text-align: left;
        flex-grow: 1;
    }
}

.preview {
    width: 50%;
    padding: 10px;
    background-color: white;
    border-left: 1px solid #ddd;

    .title-tip {
        font-size: 18px;
        font-weight: bold;
        color: #000;
    }

    .content-tip {
        text-align: left;
        padding: 10px
    }

    .author-tip {
        span:nth-child(1) {
            color: #123;
            font-size: 16px;
        }

        span:nth-child(2) {
            margin-left: 10px;
            color: #999;
            font-size: 12px;
        }
    }

    .commit-btn {
        position: absolute;
        right: 20px;
    }

    code {
        font-size: 16px;
        color: #555;
    }

    pre {
        padding: 0 10px;
        background-color: #f6f6f6;
        overflow: auto;
    }
}
</style>