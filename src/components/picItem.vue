<template>
    <div id="pic-cover">
        <img :src="bean.url" class="place-img" alt="">
        <span class="pic-descrip">{{bean.title}}</span>
        <span class="pic-date">{{bean.postTime}}</span>
        <el-popover placement="top" width="160" v-model="pop1">
            <p>确定删除吗？</p>
            <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="pop1 = false">取消</el-button>
                <el-button type="primary" size="mini" @click="pop1 = false">确定</el-button>
            </div>
            <span slot="reference"  class="pic-delete" >删除</span>
        </el-popover>
        <span class="pic-edit" @click="switchInput">编辑</span>
        <el-input type="textarea" autosize v-model="input" placeholder="请输入内容" class="pic-in" v-if="isShowEdit"></el-input>
    </div>
</template>
<script>
export default {
    props: {
        bean: {
            type: Object
        }
    },
    data() {
        return {
            pop1: false,
            input: "",
            isShowEdit: false,
        }
    },
    methods: {
        switchInput() {
            this.isShowEdit = !this.isShowEdit;
            bean.title = "123";
        }
    }

}
</script>
<style lang="scss">
@import "~@/common/base";


#pic-cover {
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
</style>