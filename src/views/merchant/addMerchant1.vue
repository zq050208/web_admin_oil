<template>
	<div class="content">
		<div class="search_cont">
      <el-form :model="merchantForm" :rules="rules" ref="antennaForm" label-width="120px" class="demo-ruleForm" style="display:flex;flex-wrap:wrap;">
        <el-form-item label="商户名称：" prop="merchantName" style="width: 30%;">
          <el-input v-model="merchantForm.merchantName" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="支付模式：" prop="payPattern" style="width: 30%;">
          <!-- <el-input v-model="merchantForm.payPattern"></el-input> -->
          <el-select v-model="merchantForm.payPattern">
            <el-option v-for="i in payWays" :label="i.name" :value="i.value" :key="i.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="微信商户号：" prop="wxMchId" style="width: 30%;">
          <el-input v-model="merchantForm.wxMchId" :disabled="editDisabled" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="主体分类：" prop="classification" style="width: 30%;">
          <el-select v-model="merchantForm.classification">
            <el-option v-for="i in merchantTypes" :label="i.name" :value="i.value" :key="i.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="营业执照：" prop="businessLicense" style="width: 30%;">
          <el-upload
            action="/platformManage/fileManage/upload"
            list-type="picture-card"
            :limit="1"
            :on-success="handleSuccess"
            :on-preview="handlePictureCardPreview"
            :on-exceed="handleExceed"
            :data="{dir: '/platform-manage/businessLicense'}"
            :file-list="fileList"
            style="height:50px;"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible1">
            <img width="100%" :src="businessLicenseUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="经营许可证：" prop="businessPermission" style="width: 30%;">
          <el-upload
            action="/platformManage/fileManage/upload"
            list-type="picture-card"
            :limit="1"
            :on-success="handleSuccess1"
            :on-preview="handlePictureCardPreview1"
            :on-exceed="handleExceed"
            :data="{dir: '/platform-manage/businessPermission'}"
            :file-list="fileList1"
            :on-remove="handleRemove1">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible2">
            <img width="100%" :src="businessPermissionUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="logo：" prop="logo" style="width: 30%;">
          <el-upload
            action="/platformManage/fileManage/upload"
            list-type="picture-card"
            :limit="1"
            :on-success="handleSuccess2"
            :on-preview="handlePictureCardPreview2"
            :on-exceed="handleExceed"
            :data="{dir: '/platform-manage/logo'}"
            :file-list="fileList2"
            :on-remove="handleRemove2">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible3">
            <img width="100%" :src="logoUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="经营地址：" prop="businessAddress" style="width: 30%;" maxlength="30">
          <el-input v-model="merchantForm.businessAddress"></el-input>
        </el-form-item>
        <el-form-item label="用户名：" prop="username" style="width: 30%;" maxlength="30">
          <el-input v-model="merchantForm.username"></el-input>
        </el-form-item>
      </el-form>
		</div>
    <div style="padding-left: 30px;"><el-button type="primary" class="button" @click="submit">保存</el-button></div>
		
  </div>
</template>
<script>
import { addStore, editStore, getStoreDetail, upload } from '@/api/api'
// import axios from "axios";
import config from '@/api/config'
export default {
  inject: ['reload'],
  components: {},
	data(){
		return {
      tableData: [],
      rules: {
        merchantName: [
					{ required: true, message: '请输入商户名称', trigger: 'blur' },
				],
        wxMchId: [
					{ required: true, message: '请输入微信商户号', trigger: 'blur' },
				],
        businessAddress: [
					{ required: true, message: '请输入经营地址', trigger: 'blur' },
				],
      },
      editDisabled: false,
      merchantForm: {
        merchantName: '',
				payPattern: 1,
        wxMchId: '',
        classification: 1,
        businessAddress: '',
        username: ''
      },
      merchantTypes: [
        {name:'民营企业',value:1},
        {name:'国营企业',value:2},
      ],
      payWays: [
        {name:'微信商户支付模式',value:1},
      ],
      fileList: [], //营业执照图片
      fileList1: [], //经营许可证
      fileList2: [], //logo
      businessLicense: '',
      businessLicenseUrl: '',
      businessPermission: '',
      businessPermissionUrl: '',
      logo: '',
      logoUrl: '',
      dialogVisible1: false,
      dialogVisible2: false,
      dialogVisible3: false
		}
  },
  watch: {
    $route:{
      handler(val,oldval){
        if(val.fullPath !== oldval.fullPath){
          this.reload()
        }
      },
      // 深度观察监听
      deep: true
    }
  },
  // beforeRouteEnter (to, from, next) {
  //   if(to.query.merchantId){
  //     to.meta.title = "编辑商户"
  //   }else{
  //     to.meta.title = "添加商户"
  //   }
  //   next()
  //     // 在渲染该组件的对应路由被 confirm 前调用
  //     // 不！能！获取组件实例 `this`
  //     // 因为当钩子执行前，组件实例还没被创建
  // },
	computed:{
    merchantId(){
      return this.$route.query.merchantId || ''
    }
	},
	mounted(){
    console.log("UPLOAD_IMG_BASE_URL",config.UPLOAD_IMG_BASE_URL)
    if(this.merchantId){
      this.getInitData()
      this.editDisabled = true
    }
	},
	methods:{
		getInitData(){
      let params = {
        merchantId: this.merchantId
      }
			getStoreDetail(params).then(res => {
        if(res.code === 0){
          this.merchantForm.merchantName = res.data[0].merchantName
          this.merchantForm.payPattern = res.data[0].payPattern
          this.merchantForm.wxMchId = res.data[0].wxMchId
          this.merchantForm.classification = res.data[0].classification
          this.merchantForm.businessAddress = res.data[0].businessAddress
          this.businessLicense = res.data[0].businessLicense
          this.businessPermission = res.data[0].businessPermission
          this.logo = res.data[0].logo
          this.fileList.push({url: config.UPLOAD_IMG_BASE_URL + res.data[0].businessLicense })
          this.fileList1.push({url: config.UPLOAD_IMG_BASE_URL + res.data[0].businessPermission })
          this.fileList2.push({url: config.UPLOAD_IMG_BASE_URL + res.data[0].logo })
        }
      })
    },
    handleChange(){

    },
    submit(){
      this.$refs.antennaForm.validate((valid) => {
        if (valid) {
          console.log("logo:",this.logo)
          if(!this.businessLicense){
            return this.$message({
              message: '请上传营业执照',
              type: 'warning'
            });
          }
          if(!this.businessPermission){
            return this.$message({
              message: '请上传经营许可证',
              type: 'warning'
            });
          }
          if(!this.logo){
            return this.$message({
              message: '请上传logo',
              type: 'warning'
            });
          }
          let params = {
            businessLicense: this.businessLicense,
            businessPermission: this.businessPermission,
            logo: this.logo,
            ...this.merchantForm
          }
          if(this.merchantId){
            let data = {
              merchantId: this.merchantId
            }
            let editParams = {
              ...params,
              ...data
            }
            editStore(editParams).then(res => {
              if(res.code === 0){
                this.$message({
                  message: '修改成功',
                  type: 'success'
                });
                this.$router.push('/merchant/merchantList')
              }
            })
          }else{
            addStore(params).then(res => {
              if(res.code === 0){
                this.$message({
                  message: '添加成功',
                  type: 'success'
                });
                this.$router.push('/merchant/merchantList')
              }
            })
          }
        }
      })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.businessLicense = ''
    },
    handleSuccess(response, file, fileList){
      this.businessLicense = response.data
    },
    handleRemove1(file, fileList) {
      this.businessPermission = ''
      console.log(file, fileList);
    },
    handleSuccess1(response, file, fileList){
      this.businessPermission = response.data
    },
    handleRemove2(file, fileList) {
      this.logo = ''
      console.log(file, fileList);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`只能上传一张图片`);
    },
    handleSuccess2(response, file, fileList){
      this.logo = response.data
    },
    handlePictureCardPreview(file) {
      if(file.response){
        this.businessLicenseUrl = config.UPLOAD_IMG_BASE_URL + file.response.data;
      }else{
        this.businessLicenseUrl = file.url
      }
      this.dialogVisible1 = true;
    },
    handlePictureCardPreview1(file) {
      if(file.response){
        this.businessPermissionUrl = config.UPLOAD_IMG_BASE_URL + file.response.data;
      }else{
        this.businessPermissionUrl = file.url
      }
      this.dialogVisible2 = true;
    },
    handlePictureCardPreview2(file) {
      if(file.response){
        this.logoUrl = config.UPLOAD_IMG_BASE_URL + file.response.data;
      }else{
        this.logoUrl = file.url
      }
      this.dialogVisible3 = true;
    },
   
	},
	created(){
		

	}
}
</script>

<style scoped lang="less">
	.content .el-input{
		width: 200px;
		margin-right: 10px;
	}
  // .content  /deep/ .el-upload--picture-card{
  //   height: 50px;
  //   position: relative;
  //   .el-icon-plus{
  //     position: absolute;
  //     top: 11px;
  //     left: 49px;
  //   }
  // }
	.search_cont{
    margin-bottom: 10px;
    display: flex;
    flex-wrap: wrap;
    .item{
      width: 25%;
      label{
        display: block;
        padding: 10px 0;
      }
    }
    .item_long{
      width: 50%;
    }
  }
  .button{
    width: 100px;
  }
	
    

</style>
