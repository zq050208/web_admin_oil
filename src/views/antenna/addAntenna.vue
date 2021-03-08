<template>
	<div class="content">
    <el-form :model="antennaForm" :rules="rules" ref="antennaForm" label-width="100px" class="demo-ruleForm" style="display:flex;flex-wrap:wrap;">
      <el-form-item label="供应商" prop="deviceManufacturer">
        <el-input v-model="antennaForm.deviceManufacturer"  maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="天线编码" prop="antennaCode" v-if="antennaId">
        <el-input v-model="antennaCode" :disabled="editDisabled" maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="天线型号" prop="deviceModel">
        <el-input v-model="antennaForm.deviceModel"  maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="天线状态" prop="totalCapacity">
        <el-select v-model="antennaForm.antennaStatus">
          <el-option v-for="item in allAntennaStatus" :label="item.name" :value="item.value" :key="item.value"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="资产状态" prop="totalCapacity">
        <el-select v-model="antennaForm.antennaStatus">
          <el-option v-for="item in totalCapacitys" :label="item.name" :value="item.value" :key="item.value"></el-option>
        </el-select>
      </el-form-item> -->
    </el-form>
    <div style="padding-left: 30px;"><el-button type="primary" class="button" @click="sureAdd">保存</el-button></div>
    
  </div>
</template>
<script>
import { addAntenna, editAntenna, getAntennaSingleDetail } from '@/api/api'
export default {
  inject: ['reload'],
  components: {},
	data(){
		return {
			antennaForm: {
				deviceManufacturer: '', //供应商
				// antennaCode: '', //天线编码
				deviceModel: '', //天线型号
        antennaStatus: 1
      },
      antennaCode: '', //天线编码
      antennaId: this.$route.query.id || '',
      type: this.$route.query.id ? 'edit' : 'add',
      editDisabled: true,
			totalCapacitys: [
				{name: '正常',value: 1},
				{name: '冻结',value: 2},
			],
      rules: {
				deviceManufacturer: [
					{ required: true, message: '请输入供应商', trigger: 'blur' },
        ],
        antennaCode: [
					{ required: true, message: '请输入天线编码', trigger: 'blur' },
				],
        deviceModel: [
					{ required: true, message: '请输入天线型号', trigger: 'blur' },
				],
      },
      allAntennaStatus: [
        {
          name: '初始',
          value: 1
        },
        {
          name: '已安装',
          value: 2
        },
        {
          name: '异常天线',
          value: 3
        },
        {
          name: '返厂修理',
          value: 4
        }
      ]
		}
	},
	computed:{
	
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
  created(){

	},
	mounted(){
		if(this.antennaId){
      this.getInitData()
    }
	},
	methods:{
    getInitData(){
      console.log("edit")
      let params = {
        id: this.antennaId
      }
      getAntennaSingleDetail(params).then(res => {
        console.log("detail:",res.data)
        this.antennaForm = { ...res.respData[0] }
        this.antennaCode = res.respData[0].antennaCode
      })
    },
    // 提交
    sureAdd(){
      this.$refs.antennaForm.validate((valid) => {
        if (valid) {
          let params = { ...this.antennaForm }
          if (this.type === 'add') {
            addAntenna(params).then(res => {
              console.log("res:",res)
              if(res.bizCode === "SUCCESS"){
                this.$message({
                  message: '添加成功',
                  type: 'success'
                });
                this.$router.push('/antenna/antennaList')
              }
            })
          } else {
            const { deviceManufacturer, deviceModel, antennaStatus } = this.antennaForm
            let data = {
              id: this.antennaId,
              deviceManufacturer: deviceManufacturer, //供应商
              deviceModel: deviceModel, //天线型号
              antennaStatus: antennaStatus
            }
            editAntenna(data).then(res => {
              if(res.bizCode === "SUCCESS"){
                this.$message({
                  message: '修改成功',
                  type: 'success'
                });
                this.$router.push('/antenna/antennaList')
              }
            })
          }
        }
      })
    }
	},

}
</script>

<style scoped lang="less">
	.content .el-input{
		width: 200px;
		margin-right: 10px;
	}
	.search_cont{
    margin-bottom: 10px;
    display: flex;
    flex-wrap: wrap;
    .item{
      width: 25%;
      label{
        display: block;
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