<template>
    <div class="edit-root">
        <div class="edit-area">
            <div class="title">
                <el-input v-model="title" placeholder="请输入标题" clearable>
                </el-input>
            </div>
            <div id="bar"></div>
            <div id="divide-edit-line"></div>
            <div id="editor"></div>
        </div>
        <div class="preview">
            <span class="title-tip">{{title}}</span>
            <el-button class="commit-btn" @click="addEssay" type="primary" icon="el-icon-check" size="mini">保存</el-button>
            <div class="author-tip">
                <span >xandone</span>
                <span >2019-11-23</span>
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
            essayId: '',
            title: '',
            editorHtml: '',
            editorText: '',
            editor: '',
            qiniu_token: '',
            selectBean: null,
        }
    },
    mounted() {
        this.selectBean = this.$route.params.selectBean;
        if (typeof this.$route.params.selectBean !== 'undefined') {
            this.selectBean = JSON.parse(this.$route.params.selectBean);
        }
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
            if (this.$route.name === 'essayAdd' && typeof this.$route.params.selectBean !== 'undefined') {
                this.selectBean = JSON.parse(this.$route.params.selectBean);
                this.fillData();
            }
        },
        fillData() {
            if (typeof this.selectBean !== 'undefined' && this.selectBean !== null) {
                this.essayId = this.selectBean.essayId;
                this.title = this.selectBean.title;
                this.editorHtml = this.selectBean.contentHtml;
                this.editorText = this.selectBean.content;
                this.title = this.selectBean.title;
                this.coverImgUrl = this.selectBean.coverImg;
                this.editor.txt.html(this.selectBean.contentHtml)
            }
        },
        getEtHtml() {
            return this.editorHtml;
        },
        getEtText() {
            return this.editorText.replace(/&nbsp;/gi, '');
        },
        getImgSrc(htmlstr) {
            var reg = /<img.+?src=('|")?([^'"]+)('|")?(?:\s+|>)/gim;
            var imgsrcArr = [];
            var tem = [];
            while (tem = reg.exec(htmlstr)) {
                imgsrcArr.push(tem[2]);
            }
            return JSON.stringify(imgsrcArr);
        },
        uploadImg() {
            this.upload_imgs();
        },
        addEssay() {
            this.$axios.post(`/essay/add`, {
                    essayId: this.essayId,
                    title: this.title,
                    artUserId: "1",
                    content: this.getEtText(),
                    contentHtml: this.getEtHtml(),
                    type: 1,
                    coverImg: this.getImgSrc(this.getEtHtml()),
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
                'video', // 插入视频
                // 'code',  // 插入代码
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
            console.log("token===" + this.qiniu_token);
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
                    if (that.editor != '') {
                        that.editor.destory();
                    }
                    that.upload_imgs();
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
<style lang="scss">
@import "@/common/base.scss";

.edit-root {
    width: 100%;
    height: 100%;
    display: flex;

    img {
        width: 760px;
    }
}

.edit-area {
    width: 50%;
    height: 100%;

    .title {
        width: 100%;
    }
}

#bar {}

#divide-edit-line {
    height: 1px;
    background-color: #ddd;
}

#editor {
    height: 100%;
    text-align: left;
}

.preview {
    width: 50%;
    padding: 10px;

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
}
</style>