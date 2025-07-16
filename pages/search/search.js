// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // shurukuang:""
    searchData:[],
    inputValue: '',  // 初始值
    wushangping:false
  },
  //输入框内容获取储存
  goSearch(e){
    // console.log(e.detail.value)
    // this.setData({
    //   shurukuang:e.detail.value
    // })
    let neirong=e.detail.value;
    if(neirong=="")
    {
      wx.showToast({
        title: '请输入内容',
        icon:"error",
        duration:1000
      })
    }else{
      wx.request({
        url: 'https://kf.webxyq.com/search',
        method:"GET",
        data:{
          appkey:"U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          name:neirong
        },
        success:res=>{
          this.setData({
            wushangping:false,
            searchData:res.data.result
          })
          console.log("searData内容=>",this.data.searchData)
          //数据为空的情况
          if(this.data.searchData.length==0)
          {
            this.setData({
              wushangping:true,
              searchData:[]
            })
          }
        }
      })
    }
  },
  QvXiao(){
    this.setData({
      inputValue:"",
      searchData:[],
      wushangping:false
    })
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