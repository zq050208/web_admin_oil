<template>
	<div class="content">
		<div class="search_cont">
      <el-form :model="merchantForm" :rules="rules" ref="antennaForm" label-width="120px" class="demo-ruleForm" style="display:flex;flex-wrap:wrap;">
        <el-form-item label="商户名称：" prop="merchantName" style="width: 50%;">
          <el-input v-model="merchantForm.merchantName" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="品牌：" prop="brandId" style="width: 50%;">
          <el-select v-model="merchantForm.brandId">
            <el-option v-for="i in allBrandList" :label="i.brandName" :value="i.id" :key="i.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公钥：" prop="merchantPublic" style="width: 50%;">
          <el-input v-model="merchantForm.merchantPublic" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="私钥：" prop="merchantPrivate" style="width: 50%;">
          <el-input v-model="merchantForm.merchantPrivate" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="微信子商户ID：" prop="wxSubMchId" style="width: 50%;">
          <el-input v-model="merchantForm.wxSubMchId" maxlength="30"></el-input>
        </el-form-item>
        
      </el-form>
		</div>
    <div style="padding-left: 30px;"><el-button type="primary" class="button" @click="submit">保存</el-button></div>
		
  </div>
</template>
<script>
import { addStore, getBrandList, editStore, getStoreDetail, upload } from '@/api/api'
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
        brandId: [
					{ required: true, message: '请输入品牌id', trigger: 'blur' },
				],
      },
      editDisabled: false,
      merchantForm: {
        merchantName: '',
        brandId: '',
        merchantPublic: '',
        merchantPrivate: '',
        wxSubMchId: ''
      },
      allBrandList: []
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
	computed:{
    merchantId(){
      return this.$route.query.merchantId || ''
    }
	},
	mounted(){
    // console.log("UPLOAD_IMG_BASE_URL",config.UPLOAD_IMG_BASE_URL)
    this.getBrandList()
    if(this.merchantId){
      this.getInitData()
      this.editDisabled = true
    }
	},
	methods:{
		getInitData(){
      let params = {
        id: this.merchantId
      }
			getStoreDetail(params).then(res => {
        if(res.bizCode === "SUCCESS"){
          this.merchantForm = { ...res.respData }
        }
      })
    },
    getBrandList(){
      getBrandList().then(res => {
        if(res.bizCode === "SUCCESS"){
          this.allBrandList = res.respData
          this.merchantForm.brandId = res.respData[0].id
        }
      })
    },
    handleChange(){

    },
    submit(){
      this.$refs.antennaForm.validate((valid) => {
        if (valid) {
          let params = {
            ...this.merchantForm
          }
          if(this.merchantId){
            let data = {
              id: this.merchantId
            }
            let editParams = {
              ...params,
              ...data
            }
            editStore(editParams).then(res => {
              if(res.bizCode === "SUCCESS"){
                this.$message({
                  message: '修改成功',
                  type: 'success'
                });
                this.$router.push('/merchant/merchantList')
              }
            })
          }else{
            addStore(params).then(res => {
              if(res.bizCode === "SUCCESS"){
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
