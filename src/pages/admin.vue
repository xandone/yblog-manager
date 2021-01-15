<template>
    <div id="admin-root">
        <headTop />
        <div class="my-admin">
            <adminMan class="admin-user" v-for=" item in adminBeans" :key="index" :adminBean="item" />
        </div>
    </div>
</template>
<script type="text/javascript">
import headTop from '@/components/HeadTop'
import adminMan from '@/components/adminMan'
import { mapState } from 'vuex'

export default {
    components: {
        headTop,
        adminMan
    },
    data() {
        return {
            adminBeans: []
        }
    },
    computed: {
        ...mapState([
            'adminId'
        ])
    },
    created() {
        this.getAllAdmins();
    },
    methods: {
        getAllAdmins() {
            this.$axios.get(`/admin/adminlist`, {
                    params: {
                        adminId: this.adminId
                    }
                })
                .then((response) => {
                    const data = response.data.data;
                    this.adminBeans = [];
                    data.forEach(item => {
                        this.adminBeans.push(item);
                    })
                })
                .catch((error) => {
                    console.log(error);
                });

        },
    }
}
</script>
<style lang="scss">
#admin-root {

    .my-admin {
        display: flex;
    }

    .admin-user {
        width: 200px;
        min-height: 250px;
        margin: 20px 0px 20px 20px;
    }

}
</style>