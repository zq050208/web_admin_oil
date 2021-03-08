<template>
	<div class="content">
		<div class="search_cont">
      <el-form :model="brandForm" :rules="rules" ref="brandForm" label-width="120px" class="demo-ruleForm" style="width:100%;display:flex;flex-wrap:wrap;">
        <el-form-item label="品牌名称：" prop="brandName" style="width: 30%;">
          <el-input v-model="brandForm.brandName" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="logo：" prop="logo" style="width: 30%;">
          <el-upload
            action="/platform/file/upload"
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
          <el-dialog :visible.sync="dialogVisible2">
            <img width="100%" :src="logoUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="运营图" prop="operationImg" style="width: 30%;">
          <el-upload
            action="/platform/file/upload"
            list-type="picture-card"
            :limit="1"
            :on-success="handleSuccess1"
            :on-preview="handlePictureCardPreview1"
            :on-exceed="handleExceed"
            :data="{dir: '/platform-manage/logo'}"
            :file-list="fileList1"
            :on-remove="handleRemove1">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible1">
            <img width="100%" :src="operationImgUrl" alt="">
          </el-dialog>
        </el-form-item>
      </el-form>
		</div>
    <div style="padding-left: 30px;"><el-button type="primary" class="button" @click="submit">保存</el-button></div>
		
  </div>
</template>
<script>
import { saveLogo } from '@/api/api'
// import axios from "axios";
import config from '@/api/config'
export default {
  // inject: ['reload'],
  components: {},
	data(){
		return {
      brandForm: {
        brandName: ''
      },
      rules: {
        brandName: [
					{ required: true, message: '请输入品牌名称', trigger: 'blur' },
				],
      },
      dialogVisible2: false,
      dialogVisible1: false,
      logo: '',
      logoUrl: '',
      operationImg: '',
      operationImgUrl: '',
      fileList2: [], //logo
      fileList1: [], //运营图
		}
  },
  watch: {
    // $route:{
    //   handler(val,oldval){
    //     if(val.fullPath !== oldval.fullPath){
    //       this.reload()
    //     }
    //   },
    //   // 深度观察监听
    //   deep: true
    // }
  },
	computed:{
    
	},
	mounted(){
    
	},
	methods:{
    handleSuccess2(response, file, fileList){
      this.logo = response.respData
    },
    handleSuccess1(response, file, fileList){
      this.operationImg = response.respData
    },
    handlePictureCardPreview2(file) {
      if(file.response){
        this.logoUrl = config.UPLOAD_IMG_BASE_URL + file.response.respData;
      }else{
        this.logoUrl = file.url
      }
      this.dialogVisible2 = true;
    },
    handlePictureCardPreview1(file) {
      if(file.response){
        this.operationImgUrl = config.UPLOAD_IMG_BASE_URL + file.response.respData;
      }else{
        this.operationImgUrl = file.url
      }
      this.dialogVisible1 = true;
    },
    handleExceed(files, fileList) {
      this.$message.warning(`只能上传一张图片`);
    },
    handleRemove2(file, fileList) {
      this.logo = ''
    },
    handleRemove1(file, fileList) {
      this.operationImg = ''
    },
    submit(){
      // console.log("111",this.logo)
      this.$refs.brandForm.validate((valid) => {
        if (valid) {
          let params = {
            brandName: this.brandForm.brandName,
            brandLogo: this.logo
          }
          saveLogo(params).then(res => {
            if(res.bizCode === "SUCCESS"){
              this.$message({
                message: '添加成功',
                type: 'success'
              });
              this.brandForm.brandName = ''
              this.logo = ''
              this.fileList2 = []
            }
          })
        }
      })
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
    width: 95%;
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
