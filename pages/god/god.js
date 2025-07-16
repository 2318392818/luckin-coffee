// pages/god/god.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //商品pid
    pid: null,
    //商品数据
    dataobjk: [],

    // 商品选项
    // 奶油
    cream: [],
    okcream: "奶油", //选择的内容，内容为默认项
    creamindex: 0, //选择下标
    //糖
    sugar: [],
    oksugar: "全糖",
    sugarindex: 0,
    //温度
    tem: [],
    oktem: "冷",
    temindex: 0,
    //奶
    milk: [],
    okmilk: "奶",
    milkindex: 0,
    //商品描述
    desc: [],
    //选择数量
    count: 1,
    //购物袋商品数量
    shopNum: null,
    //收藏商品数量
    likeNum: null,
    // 用户token
    tokenString: "",
    //判断用户登录
    isLogin: false,

    like: false
  },
  shoucang() {
    //获取收藏商品数量
    wx.request({
      url: 'https://kf.webxyq.com/findAllLike',
      method: "GET",
      data: {
        appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
        tokenString: this.data.tokenString
      },
      success: res => {
        console.log("收藏情况=》", res.data.result)
        
        this.setData({
          likeNum: res.data.result.length
        })
        //判断该页面商品是否被收藏
        let arr = res.data.result;
        for (let i = 0; i < arr.length; i++) {
          if (this.data.pid == arr[i].pid) {
            this.setData({
              like: true
            })
          }
        }

      },
      fail: err => {
        this.setData({
          isLogin: false
        })
      }
    })
  },
  //温度选择方法
  tem(e) {
    console.log(e)
    let index = e.currentTarget.dataset.index;
    let oktemtext = e.currentTarget.dataset.text;
    this.setData({
      temindex: index,
      oktem: oktemtext
    })
  },
  //奶油选择方法
  cream(e) {
    console.log(e)
    let index = e.currentTarget.dataset.index;
    let okcreamtext = e.currentTarget.dataset.text;
    this.setData({
      creamindex: index,
      okcream: okcreamtext
    })
  },
  //糖选择方法
  sugar(e) {
    console.log(e)
    let index = e.currentTarget.dataset.index;
    let oksugartext = e.currentTarget.dataset.text;
    this.setData({
      sugarindex: index,
      oksugar: oksugartext
    })
  },
  //奶选择方法
  milk(e) {
    console.log(e)
    let index = e.currentTarget.dataset.index;
    let okmilktext = e.currentTarget.dataset.text;
    this.setData({
      milkindex: index,
      okmilk: okmilktext
    })
  },
  //获取商品数据
  getProduvt() {
    wx.showLoading({
        title: "加载中",
      }),
      wx.request({
        url: 'https://kf.webxyq.com/productDetail',
        method: "GET",
        data: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          pid: this.data.pid
        },
        success: res => {
          console.log("商品详情内容=》", res.data)
          let tem = res.data.result[0].tem.split("/")
          let cream = res.data.result[0].cream.split("/")
          let sugar = res.data.result[0].sugar.split("/")
          let milk = res.data.result[0].milk.split("/")
          let desc = res.data.result[0].desc.split("\n")
          this.setData({
            dataobjk: res.data.result[0],
            tem: tem,
            cream: cream,
            sugar: sugar,
            milk: milk,
            desc: desc
          })
          console.log("dataobjk=>", this.data.dataobjk)
          setTimeout(() => wx.hideLoading(), 2000)
          console.log("dataobjk=>", this.data.dataobjk)

          this.setData({
            tem: tem,
            cream: cream,
            sugar: sugar,
            milk: milk,
            desc: desc
          })
        }
      })
  },
  //选择数量的方法
  onChange(e) {
    this.setData({
      count: e.detail
    })
    console.log("count:", this.data.count)
  },

  //加入购物车方法
  addShopBag() {
    let pid = this.data.pid
    let count = this.data.count
    let tokenString = this.data.tokenString
    let rule = this.data.oktem + '/' + this.data.oksugar + '/' + this.data.okcream + '/' + this.data.okmilk
    let isLogin = this.data.isLogin
    if (isLogin == true) {
      wx.request({
        url: 'https://kf.webxyq.com/addShopcart',
        method: "POST",
        data: {
          pid: pid,
          count: count,
          rule: rule,
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          tokenString: tokenString
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        },
        success: res => {
          // console.log("加入购物车的情况", res)
          wx.showToast({
            title: res.data.msg,
            icon: "success"
          })
          wx.request({
            url: 'https://kf.webxyq.com/shopcartCount',
            method: "GET",
            data: {
              appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
              tokenString: this.data.tokenString
            },
            success: res => {
              // console.log("购物袋商品数量", res)
              this.setData({
                shopNum: res.data.result
              })
            },
            fail: err => {
              console.log("用户没有登陆")
            }
          })
        }
      })
      //刷新购物车商品数量

    } else {
      wx.showToast({
        title: '请先登录',
        icon: "error"
      })
      wx.navigateTo({
        url: '../longin/longin',
      })
    }
  },
  // 跳转购物车
  goShopBag() {
    wx.switchTab({
      url: '../shop/shop',
    })
  },
  //收藏商品
  onlike() {
    if (this.data.like == false) {
      if (this.data.isLogin == true) {
        wx.request({
          url: 'https://kf.webxyq.com/like',
          method: "POST",
          header: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
          },
          data: {
            appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
            pid: this.data.pid,
            tokenString: this.data.tokenString
          },
          success: res => {
            console.log("收藏成功", res)
            this.setData({
              like: true
            })
            this.shoucang()
            wx.showToast({
              title: res.data.msg,
              icon: "success"
            })
          }
        })
      } else {
        wx.showLoading({
          title: '请先登录',
          icon: "error"
        })
      }
      //取消收藏
    } else if (this.data.like == true) {
      if (this.data.isLogin == true) {
        wx.request({
          url: 'https://kf.webxyq.com/notlike',
          method: "POST",
          header: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
          },
          data: {
            appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
            pid: this.data.pid,
            tokenString: this.data.tokenString
          },
          success: res => {
            console.log("取消收藏成功", res)
            this.setData({
              like: false
            })
            this.shoucang();
            wx.showToast({
              title: res.data.msg,
              icon: "success"
            })
          }
        })
      } else {
        wx.showLoading({
          title: '请先登录',
          icon: "error"
        })
      }
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
        pid: options.pid
      }),
      //获取商品数据
      this.getProduvt()
    //获取用户数据
    //获取缓存数据
    wx.getStorage({
      key: "_token",
      success: res => {
        console.log("用户已登录token为", res.data)
        this.setData({
          tokenString: res.data,
          isLogin: true
        })
        //获取购物车商品数量
        wx.request({
          url: 'https://kf.webxyq.com/shopcartCount',
          method: "GET",
          data: {
            appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
            tokenString: res.data
          },
          success: res => {
            // console.log("购物袋商品数量", res)
            this.setData({
              shopNum: res.data.result
            })
          },
          fail: err => {
            console.log("用户没有登陆")
          }
        })
        //获取收藏商品数量
        this.shoucang()
      }
    })
    this.shoucang()
    // 查询商品是否被收藏
    // wx.request({
    //   url: 'https://kf.webxyq.com/findAllLike',
    //   method:"GET",
    //   data: {
    //     appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
    //     tokenString: this.data.tokenString
    //   },
    //   success:res=>{
    //     let arr=res.data.result;
    //     for(let i=0;i<arr.length;i++){
    //       if(this.data.pid==arr[i].pid){
    //         this.setData({
    //           like:true
    //         })
    //       }
    //     }
    //   }
    // })

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