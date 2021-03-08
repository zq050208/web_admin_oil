<template>
	<div class="content">
		<el-card class="box-card search_cont">
      <div slot="header" class="clearfix">
        <span>油站信息</span>
        <el-button style="float: right;" type="primary" size="small" @click="edit">编辑</el-button>
        <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
      </div>
      <el-form :model="searchData" :rules="rules" ref="merchantForm" label-width="120px" class="demo-ruleForm" style="display:flex;flex-wrap:wrap;">
        <el-form-item label="油站名称：" prop="stationName" style="width: 30%;">
          <el-input v-model="searchData.stationName" maxlength="20" :disabled="isDisabled"></el-input>
        </el-form-item>
        <el-form-item label="油站类型：" prop="stationType" style="width: 30%;">
          <el-select v-model="searchData.stationType" @change="stationTypeChange" :disabled="isDisabled">
            <el-option v-for="i in stationTypes" :label="i.name" :value="i.value" :key="i.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="归属主体：" prop="merchantName" style="width: 30%;">
          <el-select v-model="searchData.merchantId" @change="merchantChange" :disabled="isDisabled">
            <el-option v-for="i in merchantList" :label="i.merchantName" :value="i.id" :key="i.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="油站识别码：" prop="stationCode" style="width: 30%;" v-if="gasStationId">
          <el-input v-model="stationCode" :disabled="editDisabled && isDisabled" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="所在省份：" prop="province" style="width:70%;">
          <el-select v-model="searchData.province" @change="provinceChange" :disabled="isDisabled">
            <el-option v-for="i in proviencesList" :label="i.areaName" :value="i.areaCode" :key="i.areaCode"></el-option>
          </el-select>
          <el-select v-model="searchData.city" @change="cityChange" style="margin-left: 10px;" :disabled="isDisabled">
            <el-option v-for="i in cityList" :label="i.areaName" :value="i.areaCode" :key="i.areaCode"></el-option>
          </el-select>
          <el-select v-model="searchData.county" @change="countyChange" style="margin-left: 10px;" :disabled="isDisabled">
            <el-option v-for="i in countyList" :label="i.areaName" :value="i.areaCode" :key="i.areaCode"></el-option>
          </el-select>
          <el-input v-model="searchData.address" placeholder="请输入详细地址"  maxlength="30" :disabled="!searchData.province || !searchData.city || !searchData.county || isDisabled" style="margin-left: 10px;width:250px;" @blur="adressBlur"></el-input>
        </el-form-item>
        <el-form-item label="经纬度：" prop="latLng" style="width: 30%;">
          <el-input v-model="latLng" :disabled="isDisabled"></el-input>
        </el-form-item>
        <el-form-item label="支持油品：" style="width: 30%;">
          <div v-for="(item, index) in oilsVarieties" :key="index" style="margin-top: 5px;">
            <el-checkbox v-model="item.checked" :label="item.oilsName" style="width: 60px;" :disabled="isDisabled"></el-checkbox>
            <label>价格：</label>
            <el-input v-model="item.oilsPrice" maxlength="10" placeholder="请输入油品价格" style="width: 130px;margin-left: 5px;" :disabled="isDisabled"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="管理员账号：" prop="userName" style="width: 30%;">
          <el-input v-model="searchData.userName" :disabled="isDisabled"></el-input>
          <el-switch
            v-model="searchData.switchValue"
            :disabled="isDisabled"
            active-color="#13ce66"
            inactive-color="#DCDFE6">
          </el-switch>
        </el-form-item>
      </el-form>
      <div style="width: 100px;margin:0 auto;"><el-button type="primary" class="button" @click="submit" :disabled="isDisabled">保存</el-button></div>
		</el-card>
    <el-card class="box-card" style="margin-top: 15px;">
      <el-row>
        <el-col :span="12">
          <div class="oil_gun_title"><span>油枪</span>
            <span @click="addOilGun">
              <i class="el-icon-circle-plus-outline bind-icon"></i>
              <span>添加油枪</span>
            </span>
          </div>
          <el-table
            :data="oilGunTableData"
            style="width: 100%">
            <el-table-column
              label="枪号"
            >
              <template slot-scope="scope">
                <span>{{scope.row.oilGunCode}}号枪</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="oilsName"
              label="油品"
            >
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="delOilGun(scope.$index,scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row v-if="searchData.stationType === 2">
        <el-col :span="12">
          <div class="oil_gun_title">
            <span>车道：</span>
            <span @click="addLane">
              <i class="el-icon-circle-plus-outline bind-icon"></i>
              <span>添加车道</span>
            </span>
          </div>
          <span class="item_span" v-for="(item, index) in vehicleAneVOList" :key="index">车道{{item.vehicleAneCode}}<i class="el-icon-circle-close bind-close-icon" @click="delLanes(index,item)"></i></span>
          <div v-if="vehicleAneVOList.length === 0" class="none_data">暂无数据</div>
        </el-col>
      </el-row>
      <el-row v-if="searchData.stationType === 1">
        <el-col :span="12">
          <div class="oil_gun_title">
            <span>车位</span>
            <span @click="addVehicle">
              <i class="el-icon-circle-plus-outline bind-icon"></i>
              <span>添加车位</span>
            </span>
          </div>
          <span class="item_span" v-for="(item, index) in parkingLotVOList" :key="index">车位{{item.parkingLotCode}}<i class="el-icon-circle-close bind-close-icon" @click="delCarPosition(index,item)"></i></span>
          <div v-if="parkingLotVOList.length === 0" class="none_data">暂无数据</div>
        </el-col>
      </el-row>
    </el-card>
    <el-dialog
      title="添加油枪"
			:visible.sync="oilGunDialog"
			width="60%"
    >
      <el-form>
        <el-row v-for="(item,index) in addOilGunForm" :key="index">
          <el-col :span="12">
            <el-form-item label="枪号编号：" prop="oilGunCode" style="width: 100%;">
              <el-input v-model="item.oilGunCode" style="width: 80px;" @keyup.native="number"></el-input>号
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="支持油品：" style="width: 100%;">
              <el-radio-group v-model="item.oilsName" v-for="(i,index) in oilsList" :key="index" style="margin-left: 10px;">
                <el-radio :label="i.oilsName">{{i.oilsName}}</el-radio>
                <!-- <el-radio :label="92">92#</el-radio>
                <el-radio :label="95">95#</el-radio>
                <el-radio :label="98">98#</el-radio> -->
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-button type="primary" icon="el-icon-plus" @click="addOilGunLine" class="add_btn"></el-button> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="oilGunDialog = false">取 消</el-button>
        <el-button type="primary" @click="sureAddOilGun">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="添加车位"
			:visible.sync="vehicleDialog"
			width="40%"
    >
      <el-form>
        <el-row v-for="(item, index) in addLaneForm" :key="index">
          <el-col :span="12">
            <el-form-item label="车位编号" style="width: 100%;">
              <el-input v-model="item.parkingLotCode" style="width: 80px;" @keyup.native="vehicleNumber"></el-input>号
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="对应油机：" style="width: 100%;">
              <el-input v-model="item.fillingMachine" style="width: 80px;"></el-input>
            </el-form-item>
          </el-col> -->
        </el-row>
        <!-- <el-button type="primary" icon="el-icon-plus" @click="addLaneLine" class="add_btn"></el-button> -->
        <!-- <div class="warn_text">*当油站不回传加油机信息的时候，不用填油机号</div> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="vehicleDialog = false">取 消</el-button>
        <el-button type="primary" @click="sureAddLane">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="添加车道"
			:visible.sync="laneDialog"
			width="40%"
    >
      <el-form>
        <el-row v-for="(item, index) in addVehicleForm" :key="index">
          <el-col :span="12">
            <el-form-item label="车道编号" style="width: 100%;">
              <el-input v-model="item.vehicleAneCode" style="width: 80px;" @keyup.native="laneNumber"></el-input>号
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="对应油机：" style="width: 100%;">
              <el-input v-model="item.fillingMachine" style="width: 80px;"></el-input>
            </el-form-item>
          </el-col> -->
        </el-row>
        <!-- <el-button type="primary" icon="el-icon-plus" @click="addVehicleLine" class="add_btn"></el-button> -->
        <!-- <div class="warn_text">*当油站不回传加油机信息的时候，不用填油机号</div> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="laneDialog = false">取 消</el-button>
        <el-button type="primary" @click="sureAddVehicle">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { 
  addGasStation, 
  getProvinceList,
  getStationDetail, 
  editGasStation,
  getMerchantNameList,
  addOilGun,
  deleteOilGun,
  addParkingLot,
  addvehicleAne,
  deleteParkingLot,
  deletevehicleAne
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
      },
      stationType: 1,
      stationCode: '', //油站识别码
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
      isDisabled: true, //点编辑后可编辑
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
        province: [
          { required: true, message: '请选择省份', trigger: 'change' },
        ],
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
      proviencesList: [],
      cityList: [],
      countyList: [],
      merchantList: [], //归属主体列表
      stationTypes:[{name:"车位识别",value:1},{name:"车道识别",value:2}],
      merchineForm: {
        fillingMachineId: ''
      },
      oilsList: [], //添加油枪时绑定的油品
      oilGunTableData: [], //油枪列表数据
      vehicleAneVOList: [],
      parkingLotVOList: [],
      oilGunDialog: false, //添加油枪弹窗
      // oilVaritiesDialog: false, //添加油品弹窗
      laneDialog: false, //添加车位弹窗
      vehicleDialog: false, //添加车道弹窗
      addOilGunForm: [{
        oilsName: '0#', //添加油枪--支持油品
        oilGunCode: '1', //添加油枪--枪号
      }],
      //添加车位
      addLaneForm: [{
        parkingLotCode: '',
        fillingMachine: ''
      }],
      // 添加车道
      addVehicleForm: [{
        vehicleAneCode: '',
        fillingMachine: ''
      }],
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
              provinceCnt, province, cityCnt, city, countyCnt, county, latitude, longitude, oilsList, parkingLotVOList, vehicleAneVOList, oilGunVOList
            } = res.respData[0]
            this.oilsList = oilsList
            this.parkingLotVOList = parkingLotVOList
            this.vehicleAneVOList = vehicleAneVOList
            this.oilGunTableData = oilGunVOList
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
    //编辑
    edit(){
      this.isDisabled = false
    },
    //保存
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
              this.getInitData()
            }
          })
        }
      })
    },
    //添加油枪
    addOilGun(){
      this.oilGunDialog = true
      this.addOilGunForm[0].oilGunCode = ''
      this.addOilGunForm[0].oilsName = ''
    },
     //确定添加油枪
    sureAddOilGun(){
      console.log(this.addOilGunForm)
      let oilsName = this.addOilGunForm[0].oilsName
      let oilGunCode = this.addOilGunForm[0].oilGunCode
      if(!oilGunCode){
        return this.$message({
          message: '请输入油枪编号',
          type: 'warning'
        });
      }
      if(!oilsName){
        return this.$message({
          message: '请选择油品',
          type: 'warning'
        });
      }
      let params = {
        stationId: this.gasStationId,
        oilGunCode: this.addOilGunForm[0].oilGunCode,
        oilsName: oilsName
      }
      addOilGun(params).then(res => {
        if(res.bizCode === "SUCCESS"){
          this.$message({
            message: '添加成功',
            type: 'success'
          });
          this.oilGunDialog = false
          this.getInitData()
        }
      })
    },
    //油枪编号输入框只能输入数字
    number(){　　
      this.addOilGunForm[0].oilGunCode = this.addOilGunForm[0].oilGunCode.replace('.', '')
      this.addOilGunForm[0].oilGunCode = this.addOilGunForm[0].oilGunCode.replace(/[^\.\d]/g, '')
　　},
    vehicleNumber(){
      this.addLaneForm[0].parkingLotCode = this.addLaneForm[0].parkingLotCode.replace(/[^\.\d]/g, '')
      this.addLaneForm[0].parkingLotCode = this.addLaneForm[0].parkingLotCode.replace('.', '')
    },
    laneNumber(){
      this.addVehicleForm[0].vehicleAneCode = this.addVehicleForm[0].vehicleAneCode.replace(/[^\.\d]/g, '')
      this.addVehicleForm[0].vehicleAneCode = this.addVehicleForm[0].vehicleAneCode.replace('.', '')
    },
    //删除单个油枪
    delOilGun(index, row){
      console.log(row)
      let params = {
        id: row.id
      }
      deleteOilGun(params).then(res => {
        if(res.bizCode === "SUCCESS"){
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.laneDialog = false
          this.getInitData()
        }
      })
      // this.oilGunTableData.splice(index, 1)
    },
    // 添加车道
    addLane(){
      this.addVehicleForm[0].vehicleAneCode = ''
      this.laneDialog = true
    },
    //添加车位
    addVehicle(){
      this.addLaneForm[0].parkingLotCode = ''
      this.vehicleDialog = true
    },
    //确定添加车位
    sureAddLane(){
      let parkingLotCode = this.addLaneForm[0].parkingLotCode
      if(!parkingLotCode){
        return this.$message({
          message: '请输入车位号',
          type: 'warning'
        });
      }
      let params = {
        stationId: this.gasStationId,
        parkingLotCode: parkingLotCode
      }
      addParkingLot(params).then(res => {
        if(res.bizCode === "SUCCESS"){
          this.$message({
            message: '添加成功',
            type: 'success'
          });
          this.vehicleDialog = false
          this.getInitData()
        }
      })
    },
    //确定添加车道
    sureAddVehicle(){
      let vehicleAneCode = this.addVehicleForm[0].vehicleAneCode
      if(!vehicleAneCode){
        return this.$message({
          message: '请输入车道号',
          type: 'warning'
        });
      }
      let params = {
        stationId: this.gasStationId,
        vehicleAneCode: vehicleAneCode
      }
      addvehicleAne(params).then(res => {
        if(res.bizCode === "SUCCESS"){
          this.$message({
            message: '添加成功',
            type: 'success'
          });
          this.laneDialog = false
          this.getInitData()
        }
      })
    },
    //删除车道
    delLanes(index, item){
      let params = {
        id: item.id
      }
      deletevehicleAne(params).then(res => {
        if(res.bizCode === "SUCCESS"){
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.getInitData()
        }
      })
      // this.vehicleAneVOList.splice(index, 1)
    },
    //删除车位
    delCarPosition(index, item){
      let params = {
        id: item.id
      }
      deleteParkingLot(params).then(res => {
        if(res.bizCode === "SUCCESS"){
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.getInitData()
        }
      })
      this.parkingLotVOList.splice(index, 1)
    },
    addOilGunLine(){
      let data = {
        oilGunCode: '',
        oilsName: ''
      }
      this.addOilGunForm.push(data)
    },
    addLaneLine(){
      let data = {
        parkingLotCode: '',
        fillingMachine: ''
      }
      this.addLaneForm.push(data)
    },
    addVehicleLine(){
      let data = {
        vehicleAneCode: '',
        fillingMachine: ''
      }
      this.addVehicleForm.push(data)
    }
	},
	created(){
		

	}
}
</script>

<style scoped lang="less">
  .box-card{
    width: 96%;
  }
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
  .bind-icon{
    font-size: 26px;
    color: #409EFF;
    position: relative;
    top: 4px;
    left: -3px;
  }
  .title{
    line-height: 45px;
  }
	.oil_gun_title{
    width: 100%;
    height: 40px;
    line-height: 40px;
    background: #eeeeee;
    padding: 10px;
    display: flex;
    justify-content: space-between;
  }
  .el-row{
    margin-bottom: 10px;
  }
  .item_span{
    margin: 0 15px;
    position: relative;
    display: inline-block;
    height: 40px;
    line-height: 40px;
    .bind-close-icon{
      position: absolute;
      top: 4px;
      right: -16px;
      display: none;
    }
  }
  .item_span:hover{
    .bind-close-icon{
      display: inline-block;
    }
  }
    

</style>
