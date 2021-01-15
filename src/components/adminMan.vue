<template>
    <div id="man-root">
        <el-avatar :size="80" :src="adminBean.adminIcon"></el-avatar>
        <div>
            <span class="name">{{adminBean.nickname}}</span>
        </div>
        <div class="identity">
            <i class="el-icon-user"><span>身份：</span></i>
            <span>{{adminBean.identity}}</span>
        </div>
        <div class="last-date">
            <span>最近登录:</span>
            <span>{{adminBean.lastLoginTime}}</span>
        </div>
    </div>
</template>
<script type="text/javascript">
export default {
    props: {
        adminBean: {
            type: Object
        }
    },

    data() {
        return {

        }
    }

}
</script>
<style lang="scss">
#man-root {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding-top: 20px;
    transition: all 0.5s;
    position: relative;

    .name {
        font-size: 18px;
        font-weight: bold;
    }

    .identity {
        font-size: 14px;
    }

    .last-date {
        margin-top: 20px;
        font-size: 13px;
        display: flex;
        flex-direction: column;
        justify-content: left;
        position: absolute;
        width: 100%;
        text-align: center;
        bottom: 10px;
    }
}

#man-root:hover {
    transform: scale(1.05);
}
</style>