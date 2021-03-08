<template>
    <div class="header clearfix">
        <div class="header_left">
            <span>万物互联</span>
        </div>
        <div class="header_r">
            <el-dropdown>
                <span class="el-dropdown-link">
                    万物互联
                <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="changedata">修改资料</el-dropdown-item>
                    <el-dropdown-item @click.native="add=true;dialog = true">修改密码</el-dropdown-item>
                    <el-dropdown-item @click.native="exit">注销</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <!-- 新增信息 -->
        <div>
            <el-dialog
                :title="'修改密码'"
                :visible.sync="dialog"
                style="text-align:left !important "
                :before-close="handleClose"
                width="460px"
                :modal-append-to-body='false'
            >
              <el-form :model="form" label-width="80px" ref="form">
                <el-form-item label="旧密码:" prop="oldpassword" :rules="[{ required: true, message: '请输入旧密码', trigger: 'blur' }]" >
                  <el-input v-model="form.oldpassword" autocomplete="off" style="width:260px" type="password">
                  </el-input>
                </el-form-item>
                
                <el-form-item label="新密码:" prop="newpassword" :rules="[{ required: true, message: '请输入新密码',trigger: 'blur' }]">
                  <el-input v-model="form.newpassword" autocomplete="off" style="width:260px"  type="password"></el-input>
                </el-form-item>
               
                <el-form-item label="确认密码:" prop="confirmpassword" :rules="[{ required: true, message: '请再次输入新密码',trigger: 'blur' }]" label-width="83px">
                  <el-input v-model="form.confirmpassword" autocomplete="off" style="width:260px" type="password"></el-input>
                </el-form-item>
              </el-form>
              <div class="dialog-footer" slot="footer">
                <el-button type="primary" @click="dialog = false">取 消</el-button>
                <el-button type="success" @click="saveInfo(form)">保存</el-button>
				
              </div>
            </el-dialog>
        </div>
    </div>
</template>



<script>
export default {
	data(){
		return {
        // 弹窗的信息
			dialog: false,
            form: {},
		}
	},
	computed:{
		
	},
	methods:{
        // 修改信息
        changedata(){
            this.$router.replace('/changedata')
        },
        // 注销
        exit(){
            alert('注销')
        },
        // 弹窗
        handleClose(done) {
            this.form = {}
            this.input = ''
            done();
		},
		// 提交
		saveInfo(form) {
            if(!form.oldpassword) return this.$message('请输入旧密码');
            if(!form.newpassword) return this.$message("请输入新密码");
            if(!form.confirmpassword) return this.$message("请再次输入新密码");
            if(form.newpassword!== form.confirmpassword)return this.$message("两次密码不一致");
            if(form.confirmpassword.length<6 && form.newpassword.length<6)return this.$message("新密码不能少于6位字符");
            console.log(form)
            this.dialog = false
            this.form = {}
		},
	},
	created(){
		
	}
}
</script>
<style scoped lang="less">

    .header{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 50px;
        line-height: 50px;
        background: #2b2f3a;
        z-index: 11;
        .header_left{
            float: left;
            width: 350px;
            margin-left: 45px;
            span{
                color:#DFDFDF;
            }
        }
        .header_r{
            float: right;
            margin-right: 100px;
        }
}
    .el-dropdown-link {
        cursor: pointer;
        color: #409EFF;
        font-size: 18px;
        font-weight: bold;
        
    }
    .el-icon-arrow-down {
        font-size: 16px;
    }
</style>

