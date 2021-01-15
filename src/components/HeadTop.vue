<template>
    <div id="head-root">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item style='font-size: 16px ;' :to="{ path: '/manager' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item, index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-dropdown @command="dealCommand" style="font-size: 13px;" trigger="hover" placement="bottom">
            <div class="admin-ic">
                <el-avatar :src="info.adminIcon">
                </el-avatar>
                <span class="admin-name"> {{info.nickname}}</span>
            </div>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="userInfo"><i class="el-icon-user"> 查看</i></el-dropdown-item>
                <el-dropdown-item command="exit"><i class="el-icon-remove-outline"> 退出</i></el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <el-dialog title="提示" :visible.sync="dialogVisible" width="25%">
            <span>是否退出登录？</span>
            <span slot="footer" class="dialog-footer">
               <el-button @click="dialogVisible = false">取 消</el-button>
               <el-button type="primary" @click="clearUserData">确 定</el-button>
           </span>
        </el-dialog>
    </div>
</template>
<script>
import { getStore } from '@/utils/utils'
import { USER_INFO_KEY } from '@/config/env'
import { removeStore } from '@/utils/utils.js'
export default {
    created() {
        // console.log(this.$route.meta);
        this.initUserInfo();
    },
    data() {
        return {
            info: {
                nickname: '未登录'
            },
            dialogVisible: false,
        }

    },
    methods: {
        initUserInfo() {
            let data = JSON.parse(getStore(USER_INFO_KEY));
            if (!data) {
                this.$router.push('login');
                return;
            }
            console.log("icon=" + data.adminIcon);
            this.info = data;
            this.$store.commit("initUserInfo", data.adminId);
        },
        dealCommand(command) {
            if (command == 'exit') {
                this.exitDialog();
            } else if (command == 'userInfo') {
                this.$router.push('admin');
            }

        },
        exitDialog() {
            this.dialogVisible = true;
        },

        clearUserData() {
            this.dialogVisible = false;
            removeStore(USER_INFO_KEY);
            this.$router.push('login');
        }
    }

}
</script>
<style lang="scss">
#head-root {
    background-color: #EFF2F7;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 20px;

    .admin-ic {
        display: flex;
        align-items: center;
        margin-right: 50px;

        .admin-name {
            margin-left: 5px;
        }
    }

    .admin-tv {
        font-size: 14px;
    }

}
</style>