<template>
	<div class="content">
		<div class="search_cont">
      <el-form :model="searchData" :rules="rules" ref="merchantForm" label-width="120px" class="demo-ruleForm" style="display:flex;flex-wrap:wrap;">
        <el-form-item label="油站名称：" prop="stationName" style="width: 30%;">
          <el-input v-model="searchData.stationName" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="油站类型：" prop="stationType" style="width: 30%;">
          <el-select v-model="searchData.stationType" @change="stationTypeChange">
            <el-option v-for="i in stationTypes" :label="i.name" :value="i.value" :key="i.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="归属主体：" prop="merchantName" style="width: 30%;">
          <el-select v-model="searchData.merchantId" @change="merchantChange">
            <el-option v-for="i in merchantList" :label="i.merchantName" :value="i.id" :key="i.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="油站识别码：" prop="stationCode" style="width: 30%;" v-if="gasStationId">
          <el-input v-model="stationCode" :disabled="editDisabled" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="所在省份：" prop="province" style="width:70%;">
          <el-select v-model="searchData.province" @change="provinceChange">
            <el-option v-for="i in proviencesList" :label="i.areaName" :value="i.areaCode" :key="i.areaCode"></el-option>
          </el-select>
          <el-select v-model="searchData.city" @change="cityChange" style="margin-left: 10px;">
            <el-option v-for="i in cityList" :label="i.areaName" :value="i.areaCode" :key="i.areaCode"></el-option>
          </el-select>
          <el-select v-model="searchData.county" @change="countyChange" style="margin-left: 10px;">
            <el-option v-for="i in countyList" :label="i.areaName" :value="i.areaCode" :key="i.areaCode"></el-option>
          </el-select>
          <el-input v-model="searchData.address" placeholder="请输入详细地址"  maxlength="30" :disabled="!searchData.province || !searchData.city || !searchData.county" style="margin-left: 10px;width:250px;" @blur="adressBlur"></el-input>
        </el-form-item>
        <el-form-item label="经纬度：" prop="latLng" style="width: 30%;">
          <el-input v-model="latLng"></el-input>
        </el-form-item>
        <el-form-item label="支持油品：" style="width: 30%;">
          <div v-for="(item, index) in oilsVarieties" :key="index" style="margin-top: 5px;">
            <el-checkbox v-model="item.checked" :label="item.oilsName" style="width: 60px;"></el-checkbox>
            <label>价格：</label>
            <el-input v-model="item.oilsPrice" maxlength="10" placeholder="请输入油品价格" style="width: 130px;margin-left: 5px;"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="管理员账号：" prop="userName" style="width: 30%;">
          <el-input v-model="searchData.userName"></el-input>
          <el-switch
            v-model="searchData.switchValue"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <!-- <el-form-item label="油枪数量：" prop="oilGunNumber" style="width: 30%;">
          <el-input v-model="searchData.oilGunNumber" :disabled="true" style="width: 50px;"></el-input>
          <span @click="addOilGun">
            <i class="el-icon-circle-plus-outline bind-icon" style="font-size: 24px;position:relative;top:3px;"></i>
            <span>添加油枪</span>
          </span>
        </el-form-item>
        <el-form-item label="车道数量：" prop="oilGunNumber" style="width: 30%;" v-if="stationType === 2">
          <el-input v-model="searchData.laneNum" :disabled="true" style="width: 50px;"></el-input>
          <span @click="addLane">
            <i class="el-icon-circle-plus-outline bind-icon" style="font-size: 24px;position:relative;top:3px;"></i>
            <span>添加车道</span>
          </span>
        </el-form-item>
        <el-form-item label="车位数量：" prop="carPosiitonNum" style="width: 30%;" v-if="stationType === 1">
          <el-input v-model="searchData.carPosiitonNum" :disabled="true" style="width: 50px;"></el-input>
          <span @click="addLane">
            <i class="el-icon-circle-plus-outline bind-icon" style="font-size: 24px;position:relative;top:3px;"></i>
            <span>添加车位</span>
          </span>
        </el-form-item>
        <el-form-item label="油机数量：" prop="latLng" style="width: 30%;">
          <el-input v-model="searchData.fillMerchineNum"></el-input>
        </el-form-item> -->
      </el-form>
		</div>
    <div style="padding-left: 30px;"><el-button type="primary" class="button" @click="submit">保存</el-button></div>
		<!-- <el-dialog
      title="添加油枪"
			:visible.sync="oilGunDialog"
			width="60%"
    >
      <el-form>
        <el-form-item label="枪号编号：" style="width: 100%;">
          <el-input v-model="addOilGunForm.oilGunCode" style="width: 80px;" @keyup.native="number"></el-input>号
        </el-form-item>
        <el-form-item label="支持油品：" style="width: 100%;">
          <el-radio-group v-model="addOilGunForm.radioOilVaritiesName">
            <el-radio :label="0">0#</el-radio>
            <el-radio :label="92">92#</el-radio>
            <el-radio :label="95">95#</el-radio>
            <el-radio :label="98">98#</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="oilGunDialog = false">取 消</el-button>
        <el-button type="primary" @click="sureAddOilGun">确 定</el-button>
      </span>
    </el-dialog>
		<el-dialog
      :title="stationType ? '添加车位' : '添加车道'"
			:visible.sync="laneDialog"
			width="60%"
    >
      <el-form>
        <el-form-item :label="stationType ? '车位编号' : '车道编号'" style="width: 100%;">
          <el-input v-model="addLaneForm.laneCode" style="width: 80px;" @keyup.native="number"></el-input>号
        </el-form-item>
        <el-form-item label="对应油机：" style="width: 100%;">
          <el-input v-model="addLaneForm.fillingMachine" style="width: 80px;"></el-input>
          <div class="warn_text">*当油站不回传加油机信息的时候，不用填油机号</div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="laneDialog = false">取 消</el-button>
        <el-button type="primary" @click="sureAddLane">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
import { 
  addGasStation, 
  getProvinceList,
  getStationDetail, 
  editGasStation,
  getMerchantNameList
} from '@/api/api'
import { commonMethods } from '@/utils/tools'

export default {
  inject: ['reload'],
  components: {},
	data(){
		return {
			searchData: {
				stationName: '',
        stationType: 1,
        id: 0,
        merchantId: '',
        // stationCode: '',
        address: '',
        province: '',
        city: '',
        county: '',
        switchValue: true,
        // oilGunNumber: 0, //油枪数量
        // laneNum: 0, //车道数量
        // carPosiitonNum: 0, //车位数量
        // fillMerchineNum: 0, //油机数量
        // oilsName: []
      },
      stationType: 1,
      oilGunDialog: false,
      laneDialog: false,
      stationCode: '', //油站识别码
      addOilGunForm: {
        radioOilVaritiesName: 0, //添加油枪--支持油品
        oilGunCode: 1, //添加油枪--枪号
      },
      addLaneForm: {
        laneCode: '',
        fillingMachine: ''
      },
      oilsVarieties: [
        {
          oilsName: "92#",
          oilsPrice: "",
          checked: false
        },
        {
          oilsName: "95#",
          oilsPrice: "",
          checked: false
        },
        {
          oilsName: "98#",
          oilsPrice: "",
          checked: false
        },
        {
          oilsName: "0#",
          oilsPrice: "",
          checked: false
        },
      ],
      editDisabled: true,
      rules: {
        stationName: [
					{ required: true, message: '请输入油站名称', trigger: 'blur' },
				],
        stationType: [
					{ required: true, message: '请选择油站类型', trigger: 'change' },
				],
        merchantId: [
					{ required: true, message: '请选择归属主体', trigger: 'change' },
				],
        // stationCode: [
        //   { required: true, message: '请输入油站识别码', trigger: 'blur' },
				// ],
        province: [
          { required: true, message: '请选择省份', trigger: 'change' },
        ],
        // address: [
        //   { required: true, message: '请输入详细地址', trigger: 'blur' },
				// ],
      },
      detail: {
        provinceCnt: '',
        cityCnt: '',
        county: '',
        province: '',
        city: '',
        county: '',
      },
      lat: '',
      lng: '',
      latLng: '',
      provinceCnt: '', //省份中文
      cityCnt: '', //城市中文
      countyCnt: '', //区中文
      dialogVisible: false,
      tableData: [],
      proviencesList: [],
      cityList: [],
      countyList: [],
      merchantList: [], //归属主体列表
      stationTypes:[{name:"车位识别",value:1},{name:"车道识别",value:2}],
      merchineForm: {
        fillingMachineId: ''
      },
      
		}
	},
	computed:{
		gasStationId(){
      return this.$route.query.id || ''
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
	mounted(){
		this.getInitData()
	},
	methods:{
    async getInitData(){
      //获取省份列表
      await getProvinceList().then(res => {
        this.proviencesList = res.respData  
        // console.log(res)
      })
      //获取归属主体
      await getMerchantNameList().then(res => {
        this.merchantList = res.respData
        this.searchData.merchantId = res.respData[0].id
      })
      if(this.gasStationId){
        this.editDisabled = true
        let params = {
          id: this.gasStationId
        }
        //获取详情数据
        getStationDetail(JSON.stringify(params)).then(res => {
            const { 
              stationName, stationType, merchantId, merchantName, stationCode, address, 
              provinceCnt, province, cityCnt, city, countyCnt, county, latitude, longitude, oilsList
            } = res.respData[0]
            // this.oilsList = oilsList
            this.searchData.stationName = stationName 
            this.searchData.stationType = stationType 
            this.searchData.id = this.searchData.merchantId = merchantId
            this.stationCode = stationCode 
            this.searchData.address = address 
            this.detail.provinceCnt = this.provinceCnt = this.searchData.province = provinceCnt 
            this.detail.cityCnt = this.cityCnt = this.searchData.city = cityCnt 
            this.detail.countyCnt = this.countyCnt = this.searchData.county = countyCnt
            this.detail.province = province
            this.detail.city = city
            this.detail.county = county
            this.latLng = longitude + '/' + latitude
            this.lat = latitude
            this.lng = longitude
            if(province){
              let params = {
                parentArea: province,
              }
              getProvinceList(params).then(res => {
                this.cityList = res.respData
              })
            }
            if(city){
              let params = {
                parentArea: city,
              }
              getProvinceList(params).then(res => {
                this.countyList = res.respData
              })
            }
            this.oilsVarieties.forEach(item => {
              oilsList.forEach(i => {
                if(i.oilsName === item.oilsName){
                  item.oilsPrice = i.oilsPrice/100
                  item.checked = true
                }
              })
            })
            
        })
      }
    },
    stationTypeChange(val){
      this.stationType = val
    },
    //添加油枪
    // addOilGun(){
    //   this.oilGunDialog = true
    // },
    // //确定添加油枪
    // sureAddOilGun(){
    //   this.oilGunDialog = false
    // },
    // // 添加车道
    // addLane(){
    //   this.laneDialog = true
    // },
    // //确定添加车道
    // sureAddLane(){

    // },
    number(){　　
      this.addOilGunForm.oilGunCode = this.addOilGunForm.oilGunCode.replace(/[^\.\d]/g, '')
      this.addOilGunForm.oilGunCode = this.addOilGunForm.oilGunCode.replace('.', '')
　　},
    //选择归属主体
    merchantChange(val){
      this.searchData.id = val
      let obj = []
      obj = this.merchantList.filter((item) => {
        return item.id == val
      })
      this.searchData.merchantName = obj[0].merchantName

    },
    //切换省份
    provinceChange(val){
      let obj = []
      obj = this.proviencesList.filter((item) => {
        return item.areaCode == val
      })
      this.provinceCnt = obj[0].areaName
      let params = {
        parentArea: val,
      }
      getProvinceList(params).then(res => {
        this.cityList = res.respData
        this.searchData.city = ''
        this.searchData.county = ''
        this.searchData.address = ''
      })
    },
    // 切换城市
    cityChange(val){
      let obj = []
      obj = this.cityList.filter((item) => {
        return item.areaCode == val
      })
      this.cityCnt = obj[0].areaName
      let params = {
        parentArea: val,
      }
      getProvinceList(params).then(res => {
        this.countyList = res.respData
        this.searchData.county = ''
      })
    },
    countyChange(val){
      let obj = []
      obj = this.countyList.filter((item) => {
        return item.areaCode == val
      })
      this.countyCnt = obj[0].areaName
      this.$forceUpdate()
    },
    adressBlur(e){
      let adress = this.provinceCnt + this.cityCnt + this.countyCnt + e.target.value
      console.log(adress)
      commonMethods.getLal(adress,(res) => {
        this.lat = res.detail.location.lat
        this.lng = res.detail.location.lng
        this.latLng = this.lng + '/' + this.lat
      })
    },
    submit(){
      console.log("经纬度",this.latLng)
      let oilsVarieties = this.oilsVarieties.filter(item => {
        return item.checked === true
      })
      let oilsVarietiesParams = JSON.parse(JSON.stringify(oilsVarieties))
      oilsVarietiesParams.forEach(i => {
        i.oilsPrice = Math.ceil(i.oilsPrice * 100)
      })
      if(oilsVarieties.length === 0){
        return this.$message({
          message: '请选择油品',
          type: 'warning'
        });
      }
      this.lng = this.latLng.split('/')[0]
      this.lat = this.latLng.split('/')[1]
      // console.log("oilsVarietiesParams:",oilsVarietiesParams)
      if(this.gasStationId){
        const { stationName, stationType, id, merchantName, address, province, city, county } = this.searchData
        let provinceParam, cityParam, countyParam
        const data = {
          id: this.gasStationId,
          longitude: this.lng,
          latitude: this.lat,
          gasStationId: this.gasStationId,
          stationName: stationName,
          stationType: stationType,
          merchantId: id,
          merchantName: merchantName,
          stationCode: this.stationCode,
          address: address,
          oilsList: oilsVarietiesParams 
          // oilsName: oilsName
        }
        provinceParam = province === this.detail.provinceCnt ? this.detail.province : province
        cityParam = city === this.detail.cityCnt ? this.detail.city : city
        countyParam = county === this.detail.countyCnt ? this.detail.county : county
        let regionParam = {
          province: provinceParam,
          city: cityParam,
          county: countyParam
        }
        const params = { ...data, ...regionParam }
        this.$refs.merchantForm.validate((valid) => {
          if (valid) {
            if(!this.searchData.address){
              return this.$message({
                message: '请输入详细地址',
                type: 'warning'
              });
            }
            editGasStation(params).then(res => {
              if(res.bizCode === "SUCCESS"){
                this.$message({
                  message: '修改成功',
                  type: 'success'
                });
                this.$router.push('/dashboard/dashboard')
              }
            })
          }
        })
      }else{
        const data = {
          longitude: this.lng,
          latitude: this.lat,
          oilsList: oilsVarietiesParams 
        }
        const params = { ...data, ...this.searchData }
        this.$refs.merchantForm.validate((valid) => {
          if (valid) {
            if(!this.searchData.address){
              return this.$message({
                message: '请输入详细地址',
                type: 'warning'
              });
            }
            addGasStation(params).then(res => {
              if(res.bizCode === "SUCCESS"){
                this.$message({
                  message: '添加成功',
                  type: 'success'
                });
                this.$router.push('/dashboard/dashboard')
              }
            })
          }
        })
      }
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
	.search_cont{
    margin-bottom: 10px;
    display: flex;
    flex-wrap: wrap;
    width: 95%;
    .item{
      width: 25%;
      label{
        display: block;
      }
    }
    .item_long{
      width: 75%;
      .el-select{
        margin-left: 10px;
      }
    }
  }
  .button{
    width: 100px;
  }
  .warn_text{
    color: #999;
  }
	
    

</style>
