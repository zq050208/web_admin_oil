import {get,post} from './request';
//登陆
// export const  login=(params)=>post('login',params)
// // 注销
// export const  logout=(params)=>post('logout',params)
//油站列表
export const  getGasStationList = (params) => post('/platform/station/queryPageList', params)
//添加油站
export const  addGasStation = (params) => post('/platform/station/save', params)
//修改油站
export const  editGasStation = (params) => post('/platform/station/update', params)

//获取省市区下拉列表
export const  getProvinceList = (params = {}) => post('/platform/systemArea/queryList', params)
//获取油站详情
export const  getStationDetail = (params) => post('/platform/station/stationInfo', params)
//确定添加油枪
export const  addOilGun = (params) => post('/platform/stationOilGun/save', params)
//删除油枪
export const  deleteOilGun = (params) => post('/platform/stationOilGun/delete', params)
//获取所有油品
export const  getAllOilList = (params = {}) => post('/platformManage/oilsVarietiesManage/queryList', params)
//删除油站
export const  deleteGasStation = (params) => post('/platform/station/delete', params)
//新增车位
export const  addParkingLot = (params) => post('/platform/parkingLot/save', params)
//删除车位
export const  deleteParkingLot = (params) => post('/platform/parkingLot/delete', params)
//新增车道
export const  addvehicleAne = (params) => post('/platform/vehicleAne/save', params)
//删除车道
export const  deletevehicleAne = (params) => post('/platform/vehicleAne/delete', params)
// //添加油机
// export const  addFillingMachine = (params) => post('/platformManage/fillingMachineManage/add', params)
// //修改油机
// export const  editFillingMachine = (params) => post('/platformManage/fillingMachineManage/update', params)
// //删除油机
// export const  deleteFillingMachine = (params) => post('/platformManage/fillingMachineManage/delete', params)
//天线列表
export const  getAntennaList = (params) => post('/platform/antenna/queryPageList', params)
//添加天线
export const  addAntenna = (params) => post('/platform/antenna/save', params)
//修改天线列表
export const  editAntenna = (params) => post('/platform/antenna/update', params)
//删除天线列表
export const  deleteAntenna = (params) => post('/platform/antenna/delete', params)
//修改天线列表时获取的详情
export const  getAntennaSingleDetail = (params) => post('/platform/antenna/detail', params)
//天线列表 绑定-- 查询油站列表
export const  getAllStationNames = (params) => post('/platform/station/stationNames', params)
//天线管理 绑定-- 查询车道/车位列表
export const  getAllVehiclePark = (params) => post('/platform/station/parkingOrVehicle', params)
//天线管理 绑定天线
export const  bindAntennaForStation = (params) => post('/platform/antenna/bind', params)
//获取天线列表（下拉框）为加油位，车道绑定天线
export const  getAntennaSelectList = (params = {}) => post('/platformManage/antennaManage/queryAntennaList', params)
//查询油机已绑定的天线列表
export const  getAntennaBindList = (params = {}) => post('/platformManage/antennaManage/queryBindList', params)
//查询油机已绑定的天线列表
export const  bindAntenna = (params = {}) => post('/platformManage/antennaManage/bind', params)
//获取订单列表
export const  getOrderList = (params = {}) => post('/platform/payOrder/queryPageList', params)
//获取商户列表
// export const  getStoreList = (params = {}) => post('/platformManage/merchant/queryPageList', params)
//获取商户列表 
export const  getMerchantList = (params = {}) => post('/platform/merchant/queryPageList', params)
//添加-修改油站页面 获取归属主体
export const  getMerchantNameList = (params = {}) => post('/platform/merchant/queryNamesList', params)
//商户管理 -- 获取品牌列表
export const  getBrandList = (params = {}) => post('/platform/brand/list', params)
//添加商户
export const  addStore = (params = {}) => post('/platform/merchant/save', params)
//编辑商户
export const  editStore = (params = {}) => post('/platform/merchant/update', params)
//删除商户
export const  deleteStore = (params = {}) => post('/platform/merchant/delete', params)
//查看商户详情
export const getStoreDetail = (params = {}) => post('/platform/merchant/detail', params)
//上传图片
export const upload = (params = {}) => post('/platform/fileManage/upload', params)
//保存logo
export const saveLogo = (params = {}) => post('/platform/brand/save', params)