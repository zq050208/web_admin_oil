<template>
	<div class="content">
		<div class="search_cont">
      <el-row>
        <el-col :span="6"><label>油站名称：</label><el-input v-model="detail.stationName" placeholder="" :disabled="true"></el-input></el-col>
        <el-col :span="6"><label>油站类型：</label><el-input v-model="detail.stationTypeCnt" placeholder="" :disabled="true"></el-input></el-col>
        <el-col :span="6"><label>归属主体：</label><el-input v-model="detail.merchantName" placeholder="" :disabled="true"></el-input></el-col>
        <el-col :span="6"><label>油站识别码：</label><el-input v-model="detail.stationCode" placeholder="" :disabled="true"></el-input></el-col>
      </el-row>
      <div style="height:20px;"></div>
			<el-row>
        <el-col :span="6"><label>所在省份：</label><el-input v-model="detail.address" placeholder="" style="margin-left: 10px;" :disabled="true"></el-input></el-col>
        <el-col :span="6"><label>经纬度：</label><el-input v-model="detail.latlng" placeholder="" :disabled="true"></el-input></el-col>
        <!-- <el-col :span="6"><label>油品：</label><span v-for="(item,index) in detail.oilsList" :key="index" style="margin-left: 10px;">油品：{{item.oilsName}}价格：{{item.oilsPrice/100}}</span></el-col> -->
        <!-- <el-col :span="6"><el-button type="primary" class="anniu" @click="add">添加油机</el-button></el-col> -->
      </el-row>
      <el-row>
        <el-col :span="12">
          <div class="oil_gun_title"><span>油品</span> </div>
          <el-table
            :data="detail.oilsList"
            style="width: 100%">
            <el-table-column
              prop="oilsName"
              label="油品"
            >
            </el-table-column>
            <el-table-column
              label="价格"
            >
              <template slot-scope="scope">
                <span>{{scope.row.oilsPrice/100}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
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
      <el-row v-if="detail.stationType === 2">
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
      <el-row v-if="detail.stationType === 1">
        <el-col :span="12">
          <div class="oil_gun_title">
            <span>车位：</span>
            <span @click="addVehicle">
              <i class="el-icon-circle-plus-outline bind-icon"></i>
              <span>添加车位</span>
            </span>
          </div>
          <span class="item_span" v-for="(item, index) in parkingLotVOList" :key="index">车位{{item.parkingLotCode}}<i class="el-icon-circle-close bind-close-icon" @click="delCarPosition(index,item)"></i></span>
          <div v-if="parkingLotVOList.length === 0" class="none_data">暂无数据</div>
        </el-col>
      </el-row>
		</div>
    <!-- <div class="title">加油机信息</div>
		<div class="table">
			<el-table
				:data="tableData"
				border
				style="width: 95%">
				<el-table-column
					prop="fillingMachineCode"
					label="加油机编号"
					align="center"
					>
				</el-table-column>
        <el-table-column
					prop="fillingMachineName"
					label="加油机名称"
					align="center"
					>
				</el-table-column>
				<el-table-column
					prop="oilGunNum"
					label="油枪数量"
					align="center"
					>
				</el-table-column>
				<el-table-column
					prop="oilsVarietiesName"
					label="支持油品"
					align="center"
					>
				</el-table-column>
				<el-table-column
					prop="cityCnt"
					label="车道"
					align="center"
          v-if="detail.gasStationType === 2"
				>
          <template slot-scope="scope">
            <span>{{scope.row.refuelingPosition}}条</span>
						<i class="el-icon-circle-plus-outline bind-icon" @click="positionBindAntenna(scope.row)"></i>
					</template>
				</el-table-column>
				<el-table-column
					label="加油位"
					align="center"
          v-if="detail.gasStationType === 1"
				>
          <template slot-scope="scope">
            <span>{{scope.row.refuelingPosition}}个</span>
						<i class="el-icon-circle-plus-outline bind-icon" @click="positionBindAntenna(scope.row)"></i>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="230" align="center">
					<template slot-scope="scope">
						<el-button size="mini" type="primary" @click="editRow(scope.$index,scope.row)">编辑</el-button>
						<el-button size="mini" type="danger" @click="delRow(scope.$index,scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>	
		</div> -->
    <!-- 添加油机弹窗 -->
    <!-- <el-dialog
			title="添加加油机"
			:visible.sync="dialogVisible"
			width="60%">
				<el-form :model="merchineForm" :rules="rules" ref="merchineForm" label-width="100px" class="demo-ruleForm" style="display:flex;flex-wrap:wrap;">
					<el-form-item label="加油机名称" prop="fillingMachineName" style="width: 50%;">
						<el-input v-model="merchineForm.fillingMachineName"></el-input>
					</el-form-item>
					<el-form-item label="加油机编号" prop="fillingMachineCode" style="width: 50%;" v-if="type === 'edit'">
						<el-input v-model="fillingMachineCode" :disabled="true"></el-input>
					</el-form-item>
          <el-form-item label="油枪数量" prop="oilGunNum" style="width: 50%;">
						<el-input v-model="merchineForm.oilGunNum"></el-input>
					</el-form-item>
          <el-form-item label="支持油品" style="width: 50%;">
						<el-checkbox-group v-model="merchineForm.oilsVarietiesName">
              <el-checkbox v-for="item in oilLists" v-model="item.oilsVarietiesId" :label="item.oilsVarietiesName" :key="item.oilsVarietiesId"></el-checkbox>
            </el-checkbox-group>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="dialogVisible = false">取 消</el-button>
					<el-button type="primary" @click="addFillingMachineSure">确 定</el-button>
				</span>
		</el-dialog> -->
    <!-- 添加天线弹窗 -->
    <!-- <el-dialog
      title="绑定天线"
			:visible.sync="binddialog1"
			width="60%"
    >
      <div class="text_line">
        <p>{{detail.gasStationType === 1 ? '车位' : '车道'}}</p>
        <p style="text-indent:20px;">对应天线</p>
      </div>
      <div class="ipt_line" v-for="(item,index) in antennaLines" :key="index">
        <el-input v-model="item.refuelingPositionNo" style="width: 43%;"></el-input>
        <el-select v-model="item.antennaId" style="width: 43%;">
          <el-option v-for="i in antennas" :label="i.sn" :value="i.antennaId" :key="i.antennaId"></el-option>
        </el-select>
        <el-button type="danger" icon="el-icon-delete" @click="deleteItem(index)"></el-button>
      </div>    
      <el-button type="primary" icon="el-icon-plus" @click="addLine" class="add_btn">{{detail.gasStationType === 1 ? '添加车位' : '添加车道'}}</el-button>
      <span slot="footer" class="dialog-footer">
        <el-button @click="binddialog1 = false">取 消</el-button>
        <el-button type="primary" @click="sureBindAntenna">确 定</el-button>
      </span>
    </el-dialog> -->
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
              <el-radio-group v-model="item.oilsName" v-for="(i,index) in detail.oilsList" :key="index" style="margin-left: 10px;">
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
    <!-- <el-dialog
      title="添加油品"
			:visible.sync="oilVaritiesDialog"
			width="60%"
    >
      <div v-for="(item, index) in oilsVarieties" :key="index" style="margin-top: 5px;">
        <el-checkbox v-model="item.checked" :label="item.oilsVarietiesName" style="width: 60px;"></el-checkbox>
        <label>价格：</label>
        <el-input v-model="item.price" maxlength="10" placeholder="请输入油品价格" style="width: 130px;margin-left: 5px;"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="oilVaritiesDialog = false">取 消</el-button>
        <el-button type="primary" @click="sureAddOilVarities">确 定</el-button>
      </span>
    </el-dialog> -->
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
  getStationDetail, 
  addFillingMachine, 
  editFillingMachine, 
  getAntennaSelectList, 
  getAntennaBindList,
  bindAntenna,
  getAllOilList,
  deleteFillingMachine,
  addOilGun,
  deleteOilGun,
  addParkingLot,
  addvehicleAne,
  deleteParkingLot,
  deletevehicleAne
} from '@/api/api'
export default { 
components: {},
	data(){
		return {
      // gasStationId: this.$route.query.gasStationId, //油站编号
			detail: {
				stationName: '',
        stationCode: '',
        gasStationType: 1, //1车位  2车道
        stationType: '',
        merchantName: '',
        address: '',
        latlng: ''
      },
       oilsVarieties: [
        {
          oilsVarietiesName: "0#",
          price: "",
          checked: false
        },
        {
          oilsVarietiesName: "92#",
          price: "",
          checked: false
        },
        {
          oilsVarietiesName: "95#",
          price: "",
          checked: false
        },
        {
          oilsVarietiesName: "98#",
          price: "",
          checked: false
        }
      ],
      vehicleAneVOList: [{vehicleAneCode: '1号车道', id: 1}, {vehicleAneCode: '2号车道', id: 2}],
      parkingLotVOList: [{ parkingLotCode: '一号车位', id: 1}, {parkingLotCode: '二号车位', id: 2 }],
      type: 'add', //添加和编辑加油机
      dialogVisible: false,
      binddialog1: false,
      oilGunTableData: [{oilGunCode: '1号枪', oilsName: '92#', id: 1}], //油枪列表数据
      // oilVaritiesTableData: [{oilVaritiesName: '0#', price: '4.35'}], 
      // tableData: [],
      oilGunRules: {
        oilGunCode: [
					{ required: true, message: '请输入油枪编号', trigger: 'blur' },
				],
      },
      // rules: {
      //   fillingMachineName: [
			// 		{ required: true, message: '请输入加油机名称', trigger: 'blur' },
			// 	],
      //   // fillingMachineCode: [
			// 	// 	{ required: true, message: '请输入加油机编号', trigger: 'blur' },
			// 	// ],
      //   oilGunNum: [
			// 		{ required: true, message: '请输入油枪数量', trigger: 'blur' },
			// 	],
      // },
      merchineForm: {
        fillingMachineName: '',
        // fillingMachineCode: '',
        oilGunNum: '',
        oilsVarietiesName: [],
      },
      blockMachineForm: {
        fillingMachineName: '',
        // fillingMachineCode: '',
        oilGunNum: '',
        oilsVarietiesName: [],
      },
      oilLists: [],
      antennas: [],
      antennaLines:[],
      fillingMachineCode: '', //加油机编码
      fillingMachineId: '',
      stationCode: '', //油站编码
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
    //油站id
		gasStationId(){
      return this.$route.query.id
    }
	},
	mounted(){
    this.getInitData()
    // this.getAntennaSelectList()
	},
	methods:{
		getInitData(){
      let params = {
        id: this.gasStationId
      }
      //获取详情数据
			getStationDetail(params).then(res => {
        if(res.bizCode === "SUCCESS"){
          let tempData = res.respData[0]
          // this.tableData = tempData.fillingMachineManageVOList //加油机列表
          tempData.stationType === 1 ? this.parkingLotVOList = tempData.parkingLotVOList : this.vehicleAneVOList = tempData.vehicleAneVOList
          this.oilGunTableData = tempData.oilGunVOList  //油枪列表
          this.detail = { ...res.respData[0] }
          console.log("detail:",this.detail)
          this.stationCode = tempData.stationCode
          this.detail.latlng = tempData.longitude + '/' +tempData.latitude
          this.detail.address = tempData.provinceCnt + tempData.cityCnt + tempData.countyCnt + tempData.address
        }
      })
    },
    // getAntennaSelectList(){
    //   //获取天线下拉框
    //   getAntennaSelectList().then(res => {
		// 		if(res.code === 0){
    //       this.antennas = res.data
    //       this.antennaLines.forEach(function(item){
    //         item.antennaId = res.data[0].antennaId
    //       })
		// 		}
		// 	})
    // },
    getAllOilList(){
      let params = {
        stationCode: this.stationCode
      }
      getAllOilList(params).then(res => {
        this.oilLists = res.data
        console.log(res.data)
      })
    },
    //删除绑定的车位，车道
    deleteItem(index){
      console.log(this.antennaLines,index)
      this.antennaLines.splice(index, 1)
    },
    handleChange(){

    },
    // 添加油机
    add(){
      this.dialogVisible = true
      this.type = "add"
      this.getAllOilList()
      this.merchineForm = { ...this.blockMachineForm }
    },
    //确定添加油机
    // addFillingMachineSure(){
    //   let oilName = this.merchineForm.oilsVarietiesName
    //   let oilIdList = []
    //   this.oilLists.forEach(function(item){
    //     oilName.forEach(function(i){
    //       if(i == item.oilsVarietiesName){
    //         oilIdList.push(item.oilsVarietiesId + '')
    //       }
    //     })
    //   })
    //   // let oilsVarieties = this.merchineForm.oilsVarietiesName
    //   const { oilGunNum, fillingMachineName } = this.merchineForm
    //   let params ={
    //     // gasStationCode: gasStationCode,
    //     oilsVarieties: oilIdList,
    //     oilGunNum: +oilGunNum,
    //     fillingMachineName: fillingMachineName
    //   }
    //   if (this.type === 'add') {
    //     let data = {
    //       gasStationCode: this.gasStationCode
    //     }
    //     let addParams = {
    //       ...data,
    //       ...params
    //     }
    //     this.$refs.merchineForm.validate((valid) => {
    //       if (valid) {
    //         if(oilIdList.length === 0){
    //           return this.$message({
    //             message: '请选择支持油品',
    //             type: 'warning'
    //           });
    //         }
    //         addFillingMachine(addParams).then(res => {
    //           if(res.code === 0){
    //             this.$message({
    //               message: '添加成功',
    //               type: 'success'
    //             });
    //             this.dialogVisible = false
    //             this.getInitData()
    //           }
    //         })
    //       }
    //     })
    //   } else {
    //     let data = {
    //       fillingMachineId: this.fillingMachineId,
    //       gasStationCode: this.gasStationCode,
    //       fillingMachineCode: this.fillingMachineCode
    //     }
    //     let editParams = {
    //       ...data,
    //       ...params
    //     }
    //     this.$refs.merchineForm.validate((valid) => {
    //       if (valid) {
    //         if(oilIdList.length === 0){
    //           return this.$message({
    //             message: '请选择支持油品',
    //             type: 'warning'
    //           });
    //         }
    //         editFillingMachine(editParams).then(res => {
    //           if(res.code === 0){
    //             this.$message({
    //               message: '修改成功',
    //               type: 'success'
    //             });
    //             this.dialogVisible = false
    //             this.getInitData()
    //           }
    //         })
    //       }
    //     })
    //   }
    // },
    addLine(){
      const newLine = {
        refuelingPositionNo: '',
        antennaId: 1,
        id: 0,
        fillingMachineCode: this.fillingMachineCode
      }
      this.antennaLines.push(newLine)
    },
		search(){
			this.getInitData()
		},
		// editRow(index, row){
    //   this.type = 'edit'
    //   this.dialogVisible = true
    //   this.getAllOilList()
    //   const { fillingMachineName, fillingMachineCode, oilGunNum, stationCode, fillingMachineId } = row
    //   this.fillingMachineId = row.fillingMachineId
    //   this.merchineForm.fillingMachineName = fillingMachineName
    //   this.fillingMachineCode = fillingMachineCode
    //   this.merchineForm.stationCode = stationCode
    //   this.merchineForm.oilGunNum = oilGunNum
    //   this.merchineForm.oilsVarietiesName = row.oilsVarietiesName ? row.oilsVarietiesName.split(",") : []
		// },
		// delRow(index,row){
    //   let params = {
    //     fillingMachineCode: row.fillingMachineCode
    //   }
    //   this.$confirm("确定删除吗", "提示", {
		// 		confirmButtonText: '确定',
		// 		cancelButtonText: '取消'
		// 	}).then(()=>{
    //     deleteFillingMachine(params).then(res => {
    //       this.$message({
    //         message: '删除成功',
    //         type: 'success'
    //       });
    //       this.getInitData()
    //     })
		// 	})
    // },
    //加油位绑定天线
    // positionBindAntenna(row){
    //   // console.log(row)
    //   this.binddialog1 = true
    //   let params = {
    //     fillingMachineCode: row.fillingMachineCode
    //   }
    //   this.fillingMachineCode = row.fillingMachineCode
    //   getAntennaBindList(params).then(res => {
    //     this.antennaLines = res.data
    //   })
    // },
    //确定绑定天线
    sureBindAntenna(){
      console.log("sure",this.antennaLines)
      let params = [
        ...this.antennaLines
      ]
      bindAntenna(params).then(res => {
        if(res.bizCode === "SUCCESS"){
          this.$message({
            message: '绑定成功',
            type: 'success'
          });
          this.binddialog1 = false
          this.getInitData()
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
	.content .el-input{
		width: 200px;
		margin-right: 10px;
	}
	.search_cont{
		margin-bottom: 10px;
	}
  .text_line{
    display: flex;
    p{
      width: 45%;
      text-align: left;
    }
  }
	.ipt_line{
    display:flex;
    flex-wrap:wrap;
    justify-content:space-between;
    margin-top: 10px;
  }
  .add_btn{
    margin-top: 10px;
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
    margin: 10px 0;
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
