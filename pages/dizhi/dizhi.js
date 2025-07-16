// pages/dizhi/dizhi.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: [],
  },
  // 加载地址数据
  loadAddressData() {
    const token = wx.getStorageSync('_token'); // 从本地存储获取token
    wx.request({
      url: 'https://kf.webxyq.com/findAddress',
      method: 'GET',
      data: {
        appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
        tokenString: token
      },
      success: res => {
        console.log("res是什么", res);
        if (res.data.code === 20000) {
          this.setData({
            addressList: res.data.result
          })
        }
      }
    })
  },
  // 跳转添加地址
  goNewaddress() {
    wx.navigateTo({
      url: '/pages/Newaddress/Newaddress',
    })
  },
  // 跳转编辑地址
  goEditAddress(e) {
    let aid =e.currentTarget.dataset.aid
    wx.navigateTo({
      url: `/pages/editAddress/editAddress?aid=${aid}`
    })
    console.log("aid测试",e.currentTarget.dataset);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadAddressData()
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
    this.loadAddressData()
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