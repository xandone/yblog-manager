<template>
    <el-container style="height: 100%; border: 1px solid #eee">
        <el-aside width="280px">
            <el-menu style="height: 100%; text-align: left" :default-active="defaultActive" background-color="#fff" text-color="#666" router>
                <el-menu-item index="manager"><i class="el-icon-s-home"></i>首页</el-menu-item>
                <el-submenu index="1">
                    <template slot="title"><i class="el-icon-notebook-1"></i>文章管理</template>
                    <el-menu-item-group>
                        <el-menu-item index="artList">文章列表</el-menu-item>
                        <el-menu-item index="artAdd">发布文章</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu index="2">
                    <template slot="title"><i class="el-icon-notebook-2"></i>杂文管理</template>
                    <el-menu-item-group>
                        <el-menu-item index="essayList">杂文列表</el-menu-item>
                        <el-menu-item index="essayAdd">发布杂文</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu index="3">
                    <template slot="title"><i class="el-icon-picture-outline-round"></i>图片管理</template>
                    <el-menu-item-group>
                        <el-menu-item index="photoAdd">新增图片</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu index="4">
                    <template slot="title"><i class="el-icon-user"></i>管理员</template>
                    <el-menu-item-group>
                        <el-menu-item index="admin">管理员</el-menu-item>
                        <el-menu-item index="logAdd">日志更新</el-menu-item>
                        <el-menu-item index="apkVersion">apk版本</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
            </el-menu>
        </el-aside>
        <el-main style="padding: 0; overflow: auto;">
            <keep-alive>
                <router-view></router-view>
            </keep-alive>
        </el-main>
    </el-container>
</template>
<script>
export default {
    data() {
        const item = {};
        return {
            tableData: Array(20).fill(item)
        }
    },
    computed: {
        defaultActive: function() {
            return this.$route.path.replace('/', '');
        }
    },
};
</script>
<style>
.el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
}

.el-aside {
    color: #333;
}

.fillcontain {
    height: 100%;
    width: 100%;
}
</style>