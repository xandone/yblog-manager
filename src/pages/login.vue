<template>
    <div class="fillcontain login-bg">
        <div class="logo-root">
            <img class="dog-logo" src="@/assets/dog.jpg" alt="">
            <div><span style="color: #fff; font-weight: bold;font-size: 20px;">y-blog</span></div>
            <div><span style="color: #fff; font-size: 14px;" >管理系统</span></div>
        </div>
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
            <el-form-item label="用户名" prop="pass">
                <el-input v-model="ruleForm.pass" autocomplete="off" placeholder='用户名'></el-input>
            </el-form-item>
            <el-form-item label="密　码" prop="checkPass">
                <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off" placeholder='密码' show-password></el-input>
            </el-form-item>
            <el-form-item>
                <el-button class='btn' type="primary" @click="submitForm('ruleForm')">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { setStore } from '@/utils/utils.js'
import { USER_INFO_KEY } from '@/config/env'
import { mapState } from 'vuex'
import md5 from 'js-md5';
export default {
    computed: {
        ...mapState([
            'adminId'
        ])
    },
    data() {
        var name = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入用户名'));
            } else {
                if (this.ruleForm.checkPass !== '') {
                    this.$refs.ruleForm.validateField('checkPass');
                }
                callback();
            }
        };
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                callback();
            }
        };
        return {
            ruleForm: {
                pass: '',
                checkPass: ''
            },
            rules: {
                pass: [
                    { validator: name, trigger: 'blur' }
                ],
                checkPass: [
                    { validator: validatePass, trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.login();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },

        login() {
            let md5pass = md5(this.ruleForm.checkPass);
            this.$axios.post(`/admin/login`, {
                    name: this.ruleForm.pass,
                    psw: md5pass
                })
                .then((response) => {
                    const user = response.data;
                    if (user.code === 200) {
                        this.$router.push('manager');
                        setStore(USER_INFO_KEY, user.data[0]);
                        this.$store.commit("initUserInfo", user.data[0].adminId);

                    } else {
                        this.openToast(user.msg);
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
<style>
.login-bg {
    display: flex;
    justify-content: left;
    align-items: center;
    background-color: #324057;
    background: url('../assets/bg.jpg');
}

.demo-ruleForm {
    width: 320px;
    height: 210px;
    padding: 25px;
    text-align: center;
    /*background-color: #fff;*/

}

.btn {
    width: 100%
}

.logo-root {
    margin-left: 50px;
    height: 210px;
    padding: 25px;
    /*background-color: #fff;*/
    /*opacity: 0.2;*/
}

.dog-logo {
    width: 100px;
    height: 100px;
}
</style>