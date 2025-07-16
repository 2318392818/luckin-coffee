// pages/shoucang/shoucang.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 用户token
    tokenString: "",
    // 商品数据
    god: [],
  },

  //   跳转商品详情的方法
  goDetail(e) {
    console.log("e是什么", e);
    console.log("跳转商品详情的pid=>", e.currentTarget.dataset.pid);
    wx.navigateTo({
      url: `../detail/detail?pid=${e.currentTarget.dataset.pid}`,
    })
  },
  // 获取用户所有收藏商品
  getAllLike() {
    wx.getStorage({
      key: "_token",
      success: res => {
        this.setData({
          tokenString: res.data
        })
        console.log("获取token：", this.data.tokenString)
        wx.request({
          url: 'https://kf.webxyq.com/findAllLike',
          method: "GET",
          data: {
            appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
            tokenString: this.data.tokenString
          },
          success: res => {
            // console.log("fjslkd",res)
            this.setData({
              god: res.data.result
            })
            console.log(this.data.god)
          }
        })
      }
    })
  },
  // 取消收藏
  notLike(e) {
    const pid = e.currentTarget.dataset.pid;
    const tokenString = this.data.tokenString;
    wx.showLoading({
      title: '处理中...'
    });
    // 调用取消收藏API
    wx.request({
      url: 'https://kf.webxyq.com/notlike',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
        tokenString: tokenString,
        pid: pid // 传递商品ID
      },
      success: (res) => {
        wx.hideLoading();
        // 修改这里的判断条件
        if (res.data.code === 'L001' || res.data.msg === '已取消收藏') {
          const newGod = this.data.god.filter(item => item.pid !== pid);
          this.setData({
            god: newGod
          });
          wx.showToast({
            title: '已取消收藏',
            icon: 'success'
          });
        } else {
          wx.showToast({
            title: '操作失败: ' + res.data.msg,
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        wx.hideLoading();
        wx.showToast({
          title: '网络错误',
          icon: 'error'
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const token = wx.getStorageSync('_token');
    if (!token) {
      wx.redirectTo({
        url: '/pages/login/login'
      });
      return;
    }
    this.setData({
      tokenString: token
    });
    this.getAllLike();
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
    this.getAllLike()
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