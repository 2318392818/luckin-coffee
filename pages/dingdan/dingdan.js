// pages/dingdan/dingdan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 确定标签
    tokenString: "",
    Onindex: "0",
    // 订单状态
    over: "已完成",
    noneover: "确认收货",
    //初始订单数据
    dingdan: null,
    //分类订单数据
    ALLdingdan: null,
    //加入统计后的订单数据
    processedOrders: null,
    oids:""
  },
  //切换标签时确定标签
  onClick(e) {
    this.setData({
      Onindex: e.detail.index
    })
    let arr = this.data.dingdan
    let newarr = arr.filter(item => item.status === this.data.Onindex)
    this.setData({
      ondingdan: newarr
    })
  },

  //添加统计信息(分类完的二层数组再加一层)
  countGodItems() {
    //将分类后的数据通过map处理后写入arr
    let arr = this.data.ALLdingdan.map(orderGroup => {
      // 计算当前订单商品总量
      const totalQuantity = orderGroup.reduce((sum, item) => {
        return sum + (item.count || 0); 
      }, 0);
      const totalPrice = orderGroup.reduce((sum, item) => {
        return sum + (item.price * item.count || 0)
      }, 0)
      // 保留原订单结构并添加统计信息
      return {
        status: orderGroup[0].status,//获取第一个商品的状态，即订单状态
        time: orderGroup[0].updatedAt.replace(/[a-zA-Z]/g, ' '),//获取取第一个商品的时间，即订单时间
        orderNumber: orderGroup[0].oid, // 取第一个商品的订单号，即订单号
        items: orderGroup,//将分类好的数值写入成为统计数组
        totalItems: orderGroup.length, // 商品种类数
        totalQuantity: totalQuantity,   // 商品总数量
        totalPrice: totalPrice//商品总价
      };
    })
    //将arr写入processedOrders
    this.setData({
      processedOrders: arr
    })
    console.log("统计后数据", this.data.processedOrders)
  },

  //订单封装（根据订单号分类）
  fenlei() {
    let godMap = new Map();
    this.data.dingdan.forEach(element => {
      let dingdanID = element.oid;
      if (!godMap.has(dingdanID)) {
        godMap.set(dingdanID, [])
      }
      godMap.get(dingdanID).push(element);
    });
    this.setData({
      ALLdingdan: Array.from(godMap.values())
    })
    console.log("分类后订单", this.data.ALLdingdan)
    //进行信息统计
    this.countGodItems()
  },


  //获取订单信息
  dindan() {
    // this.token()
    wx.getStorage({
      key: "_token",
      success: res => {
        console.log("用户已登录token为", res.data)
        this.setData({
          tokenString: res.data
        })
        wx.request({
          url: 'https://kf.webxyq.com/findOrder',
          method: "GET",
          data: {
            appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
            tokenString: res.data,
            status: "0"
          }, success: res => {
            console.log("订单信息=>", res)
            this.setData({
              dingdan: res.data.result
            })
            //对订单内容根据订单号封装
            this.fenlei()
          }
        })
      }, fail: err => {
        wx.showLoading({
          title: '请先登录',
          icon: "error"
        })
      }
    })
  },
//确认收货
queren(e) {
  // console.log("e:",e)
  let oid=e.currentTarget.dataset.oid
  this.setData({
    oids:e.currentTarget.dataset.oid
  })
  // console.log(1122,this.data.tokenString);
  // console.log("oid:",oid)
  wx.request({
    url: 'https://kf.webxyq.com/receive',
    method: "POST",
    data: {
      appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
      tokenString: this.data.tokenString,
      oid: this.data.oids,
    },header: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
    },
    success:res=>{
      console.log("删除结果：",res)
      this.dindan()
    }
  })
},
  //删除订单
  shanchu(e) {
    // console.log("e:",e)
    let oid=e.currentTarget.dataset.oid
    this.setData({
      oids:e.currentTarget.dataset.oid
    })
    console.log(1122,this.data.tokenString);
    console.log("oid:",oid)
    wx.request({
      url: 'https://kf.webxyq.com/removeOrder',
      method: "POST",
      data: {
        appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
        tokenString: this.data.tokenString,
        oid: this.data.oids,
      },header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      success:res=>{
        console.log("删除结果：",res)
        this.dindan()
      }
    })
  },
  // 获取token
  token() {
    // console.log(123456);
    wx.getStorage({
      key: "_token",
      success: res => {
        this.dindan();
        console.log("用户已登录token为", res.data)
        this.setData({
          tokenString: res.data
        })
      }, fail: err => {
        wx.showToast({
          title: '请先登录',
          icon: "error"
        })
        wx.navigateTo({
          url: '../longin/longin',
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // this.token()
    this.dindan()
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