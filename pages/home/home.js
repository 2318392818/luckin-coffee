// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerData: [],
    HotData:[],
    times:"",
    YHname:"无登录",
    tokenString:"",
  },

  // 轮播图
  getBanner() {
    wx.request({
      url: 'https://kf.webxyq.com/banner',
      method: "GET",
      data: {
        appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA="
      },
      success: res => {
        console.log("轮播图数据=》", res)
        this.setData({
          bannerData: res.data.result
        })
      }
    })
  },
//
// 获取数据
times(){
  let ima =new Date().getHours();
  if(ima<5){
    this.setData({times:"凌晨好"})
  }else if(ima>=5&&ima<11){
    this.setData({times:"早上好"})
  }else if(ima>=11&&ima<14){
    this.setData({times:"中午好"})
  }else if(ima >=14&&ima<19){
    this.setData({times:"下午好"})
  }else if(ima >=19&&ima<=24){
    this.setData({times:"晚上好"})
  }
},
  // 热卖
  getHotData(){
    wx.request({
      url: 'https://kf.webxyq.com/typeProducts',
      method: "GET",
      data: {
        appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
        key:'isHot',
        value:1
      },
      success:res=>{
        console.log("热门商品数据=>",res)
        this.setData({
          HotData:res.data.result
        })
      }
    })
  },
  //跳转页面
  goSearch(){
    //跳转普通页面
    wx.navigateTo({
      url: '../search/search',
    })
    //跳转特殊页面
    //跳转底部tab栏页面
    // wx.switchTab({
    //   url: 'url',
    // })
  },
  //跳转登录界面
  golongin(){
    
    wx.navigateTo({
      url: '../longin/longin',
    })
   
  },

  //调整商品详情
  gogod(e){
    console.log("商品id=》",e.currentTarget.dataset.pid)
    wx.navigateTo({
      url: `../god/god?pid=${e.currentTarget.dataset.pid}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getBanner(),
    this.getHotData(),
    this.times(),
    wx.getStorage({
      key:"_token",
      success:res=>{
        console.log("用户已登录token为", res.data)
        this.setData({
          tokenString: res.data,
        })
        wx.request({
          url: 'https://kf.webxyq.com/findMy',
          method:"GET",
          data:{
            tokenString: this.data.tokenString,
            appkey:"U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA="
          },
          success:res=>{
            // console.log("用户数据=》",res)
            this.setData({
              YHname:res.data.result[0].nickName
            })
          },fail:err=>{
            this.setData({
              YHname:"无登录"
            })
          }
        })
      }
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    wx.getStorage({
      key:"_token",
      success:res=>{
        console.log("用户已登录token为", res.data)
        this.setData({
          tokenString: res.data,
        })
        wx.request({
          url: 'https://kf.webxyq.com/findMy',
          method:"GET",
          data:{
            tokenString: this.data.tokenString,
            appkey:"U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA="
          },
          success:res=>{
            // console.log("用户数据=》",res)
            this.setData({
              YHname:res.data.result[0].nickName
            })
          },fail:err=>{
            this.setData({
              YHname:"无登录"
            })
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    wx.getStorage({
      key:"_token",
      success:res=>{
        console.log("用户已登录token为", res.data)
        this.setData({
          tokenString: res.data,
        })
        wx.request({
          url: 'https://kf.webxyq.com/findMy',
          method:"GET",
          data:{
            tokenString: this.data.tokenString,
            appkey:"U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA="
          },
          success:res=>{
            // console.log("用户数据=》",res)
            this.setData({
              YHname:res.data.result[0].nickName
            })
          },fail:err=>{
            this.setData({
              YHname:"无登录"
            })
          }
        })
      }
    });
    if(this.data.tokenString==""){
      console.log("token为空")
      this.setData({
        YHname:"无登录"
      })
    }
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