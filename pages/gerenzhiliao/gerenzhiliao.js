// pages/gerenzhiliao/gerenzhiliao.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: "",
    shoujihao: "",
    name: "",
    jianjie: "",
    tokenString: ""
  },
  // 获取用户token
  isLongin() {
    wx.getStorage({
      key: "_token",
      success: res => {
        console.log("用户已登录token为", res.data)
        this.setData({
          tokenString: res.data,
        })
        wx.request({
          url: 'https://kf.webxyq.com/findAccountInfo',
          method: "GET",
          data: {
            tokenString: this.data.tokenString,
            appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA="
          },
          success: res => {
            console.log("用户数据=》", res)
            //写入用户数据
            this.setData({
              name: res.data.result[0].nickName,
              shoujihao: res.data.result[0].phone,
              uid: res.data.result[0].userId,
              jianjie: res.data.result[0].desc
            })
          },//获取失败返回登陆界面
           fail: err => {
            wx.showToast({
              title: '请先登录',
              icon: "error"
            })
            wx.navigateTo({
              url: '../longin/longin',
            })
          }
        })
      }
    })
  },

  //收集输入框内容
  Setjianjie(e) {
    console.log(e.detail)
    this.setData({
      jianjie: e.detail
    })
  },
  //焦点消失后上传简介内容
  handleBlur() {
    // 检查是否有必要的数据
    if (!this.data.tokenString || !this.data.jianjie) {
      wx.showToast({
        title: '数据不完整',
        icon: 'none'
      });
      return;
    }
  
    // 上传
    wx.request({
      url: 'https://kf.webxyq.com/updateDesc', 
      method: "POST",
      data: {
        tokenString: this.data.tokenString, // 用户认证信息
        appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=", 
        desc: this.data.jianjie // 简介内容
      },header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      success: (res) => {
        // 请求成功处理
        console.log("上传成功", res.data); // 打印服务器响应数据
        wx.showToast({
          title: res.data.msg || '上传成功', // 显示服务器返回的消息或默认消息
          icon: res.data.success ? 'success' : 'none' // 根据服务器响应决定是否显示成功图标
        });
      },
      fail: (err) => {
        // 请求失败处理
        console.error("上传失败", err);
        wx.showToast({
          title: '上传失败',
          icon: 'none'
        });
      }
    });
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.isLongin()
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