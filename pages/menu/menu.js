// pages/menu/menu.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //标签数值绑定
    activeNum: 0,
    //定义一个数组存储key
    keyArr: ["isHot", "type", "type", "type", "type"],
    // 定义一个数组储存value
    valueArr: ["1", "latte", "coffee", "rena_ice", "fruit_tea"],

  //   例如查看最新推荐商品(热卖推荐)
  //   {
  //     appkey: 你的appkey,
  //     key: 'isHot',
  //     value: 1
  //   },

  // 例如查看咖啡类型商品
  //   {
  //     appkey: 你的appkey,
  //     key: 'type',
  //     value: 'coffee'
  //   }
    // 数据的集合
    menuData: []
  },

  //   跳转商品详情的方法
  goDetail(e) {
    console.log("跳转商品详情的pid=>", e.currentTarget.dataset.pid);
    wx.navigateTo({
      url: `../god/god?pid=${e.currentTarget.dataset.pid}`,
    })
  },
  // 跳转搜索页面的方法
  goSearch() {
    
    wx.navigateTo({
      url: '../search/search',
    })
  },

  //点击触发获取商品
  onChange(e) {
    console.log(e.detail);
    this.setData({
      activeNum: e.detail
    })
    this.getTypeProduce();
  },

  // 根据商品的类型进行查询商品
  getTypeProduce() {
    
    // 分类的下标
    let activeNum = this.data.activeNum;
    // 参数key的数组
    let key = this.data.keyArr;
    // 参数value 的数组
    let value = this.data.valueArr;
    wx.request({
      url: 'https://kf.webxyq.com/typeProducts',
      method: "GET",
      data: {
        appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
        key: key[activeNum],
        value: value[activeNum]
      },
      success: res => {
        console.log("根据类型请求的数据=>", res.data);
        this.setData({
          menuData: res.data.result
        })
      }
    })
  },
  // 查看所有商品类型
  // getAllType(){
  //   wx.request({
  //     url: 'https://kf.webxyq.com/type',
  //     method: "GET",
  //     data: {
  //       appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA="
  //     },
  //     success: res => {
  //       console.log("所有商品的类型查询=>", res);
  //     }
  //   })
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // this.getAllType();
    this.getTypeProduce();
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