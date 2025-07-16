

// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    appkey:"U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
    mineObj:[],
    tokenString:"?",
  },


  //检测登录
  iflongin(){
    wx.getStorage({
      key:"_token",
      success:res=>{
        this.setData({
          tokenString:res.data
        })
        wx.request({
          url: 'https://kf.webxyq.com/findMy',
          method:"GET",
          data:{
            appkey:this.data.appkey,
            tokenString:res.data
          },success:res=>{
            console.log("个人资料信息的数据=>",res.data.result);
            this.setData({
              mineObj:res.data.result
            })
          }

        })
      },fail:err=>{
        console.log("用户未登录！");
        wx.navigateTo({
          url: '../longin/longin',
        })
        wx.showToast({
          title: '请先登录',
          icon:"error"
        })
      }
    })
  },
//跳转详细信息显示
tiaozhuan(e){
  console.log("pa=》",e)
  wx.navigateTo({
    url: '../'+e.currentTarget.dataset.name+"/"+e.currentTarget.dataset.name,
  })
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.getStorage({
      key:"_token",
      success:res=>{
        this.setData({
          tokenString:res.data
        })
        wx.request({
          url: 'https://kf.webxyq.com/findMy',
          method:"GET",
          data:{
            appkey:this.data.appkey,
            tokenString:res.data
          },success:res=>{
            console.log("个人资料信息的数据=>",res.data.result);
            this.setData({
              mineObj:res.data.result
            })
          }

        })
      },fail:err=>{
        console.log("用户未登录！");
        wx.navigateTo({
          url: '../longin/longin',
        })
        wx.showToast({
          title: '请先登录',
          icon:"error"
        })
      }
    })
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
    // // 每次页面显示（包括tab切换、后台返回）时触发
    // this.monitorAction()  // 调用监测函数
    this.iflongin()
  },
  // monitorAction() {
  //   console.log("页面切换监测已触发")
  //   // 此处添加你的监测逻辑（如数据检查、状态更新等）
  // },

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