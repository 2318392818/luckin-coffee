// pages/Newaddress/Newaddress.js
import {
  areaList
} from '@vant/area-data';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false, // 控制弹出层显示
    Name: "",
    Tel: "",
    Address: "",
    Post: "",
    areaList,
    checked: false, // 添加默认地址开关状态
    regionText: "", // 存储选中的地区文本
    selectedRegion: [] // 存储省市区编码数组，如 ['440000', '440300', '440303']
  },
  // 处理switch开关变化
  onChange(e) {
    this.setData({
      checked: e.detail
    });
  },
  // 显示弹出层
  showPopup() {
    this.setData({
      show: true
    });
  },
  // 关闭弹出层
  onClose() {
    this.setData({
      show: false
    })
  },
  // 处理地区选择确认
  onAreaConfirm(e) {
    // console.log("e.detail.values是数组",e);
    const values = e.detail.values;
    // 拼接选中的地区文本 (省+市+区)
    const regionText = values.map(item => item.name).join("/");
    // 获取选中的地区码
    const selectedRegion = values.map(item => item.code);
    this.setData({
      regionText,
      selectedRegion,
      show: false // 关闭弹出层
    });
    console.log("选中的地区:", regionText);
    console.log("地区码:", selectedRegion);
  },
  // 获取姓名
  getName(e) {
    // console.log("获取到input数据",e.detail);
    let name = e.detail;
    this.setData({
      Name: name
    })
  },
  // 获取电话
  getTel(e) {
    let tel = e.detail;
    this.setData({
      Tel: tel
    })
  },
  // 获取详细地址
  getAddress(e) {
    let address = e.detail;
    this.setData({
      Address: address
    })
  },
  // 获取邮政编码
  getPost(e) {
    let post = e.detail;
    this.setData({
      Post: post
    })
  },
  // 新增提交方法
  submitAddress() {
    // 1. 表单验证
    if (!this.data.Name || !this.data.Tel || !this.data.selectedRegion.length) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      })
      return;
    }
    // 2. 准备请求参数
    const params = {
      tokenString: wx.getStorageSync('_token'), // 从本地存储获取token
      appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
      name: this.data.Name,
      tel: this.data.Tel,
      province: this.data.regionText.split('/')[0] || '',
      city: this.data.regionText.split('/')[1] || '',
      county: this.data.regionText.split('/')[2] || '',
      addressDetail: this.data.Address,
      areaCode: this.data.selectedRegion[2] || '',
      postalCode: this.data.Post,
      isDefault: this.data.checked ? 1 : 0 // 转换为接口要求的0/1
    };
    // 3. 调用新增地址接口
    wx.request({
      url: 'https://kf.webxyq.com/addAddress',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      data: params,
      success: (res) => {
        console.log("res是什么", res);
        if (res.data.code === 9000) {
          wx.showToast({
            title: res.data.msg,
          });
          setTimeout(() => wx.navigateBack(), 1500); // 返回上一页
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '请求失败',
          icon: 'none'
        });
        console.error('API Error:', err);
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})