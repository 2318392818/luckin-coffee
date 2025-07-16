// pages/longin/longin.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inpshowPassword: false,
    regshowPassword: false,
    inpShouJiHaoData: "",
    inppassword: "",
    show: false,
    regShouJiHaoData: "",
    regpassword: "",
    regname: "",
    inpphoneMessgae: "",
    regphoneMessgae: "",
    inppasswordMessgae: "",
    regpasswordMessgae: "",
  },

  //密码是否显示
  inptogglePassword() {
    this.setData({
      inpshowPassword: !this.data.inpshowPassword
    })
  },
  regtogglePassword() {
    this.setData({
      regshowPassword: !this.data.regshowPassword
    })
  },

  //登录输入手机号和输入密码
  inpPhone(e) {
    let phone = e.detail;
    let ruguo= this.inpphoneMessgae(phone)
    if(ruguo){
    this.setData({
      inpShouJiHaoData: phone
    })
    console.log(this.data.inpShouJiHaoData)}
  },
  inpPssword(e) {
    let pw = e.detail;
    let ruguo= this.inppasswordMessgae(pw)
    if(ruguo){
    this.setData({
      inppassword: pw
    })
    console.log(this.data.inppassword)
  }
  },
  //注册输入手机号和输入密码和昵称
  regName(e) {
    let name = e.detail;
    this.setData({
      regname: name
    })
    console.log(this.data.regname)
  },
  regPhone(e) {
    let phone = e.detail;
    let ruguo=this.regphoneMessgae(phone)
    if(ruguo){
    this.setData({
      regShouJiHaoData: phone
    })
    console.log(this.data.regShouJiHaoData)
  }
  },
  regPssword(e) {
    let pw = e.detail;
    let ruguo= this.regpasswordMessgae(pw)
    if(ruguo){
    this.setData({
      regpassword: pw
    })
    console.log(this.data.regpassword)
    }
  },

  //判断手机号
  inpphoneMessgae(phone) {
    if (!/^1[3-9]\d{9}$/.test(phone) && !phone == "") {
      this.setData({
        inpphoneMessgae: "请输入有效的11位手机号"
      })
      return false;
    } else {
      this.setData({
        inpphoneMessgae: ""
      })
      return true;
    }
  },
  regphoneMessgae(phone) {
    if (!/^1[3-9]\d{9}$/.test(phone) && !phone == "") {
      this.setData({
        regphoneMessgae: "请输入有效的11位手机号"
      })
      return false;
    } else {
      this.setData({
        regphoneMessgae: ""
      })
      return true;
    }
  },
  //判断密码格式
  inppasswordMessgae(password) {
    if (!/^[A-Za-z0-9]{6,16}$/.test(password) && !password == "") {
      this.setData({
        inppasswordMessgae: "密码格式错误",
      })
      return false;
    } else {
      this.setData({
        inppasswordMessgae:""
      })
      return true;
    }
  },
  regpasswordMessgae(password) {
    if (!/^[A-Za-z0-9]{6,16}$/.test(password) && !password == "") {
      this.setData({
        regpasswordMessgae: "密码格式错误",
      })
      return false;
    } else {
      this.setData({
        regpasswordMessgae: ""
      })
      return true
    }
  },
  // 登录函数
  Longin() {
    wx.request({
      url: 'https://kf.webxyq.com/login',
      method: "POST",
      data: {
        appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
        password: this.data.inppassword,
        phone: this.data.inpShouJiHaoData
      }, header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      success: res => {

        //手机号没注册
        console.log(res.data)
        if (res.data.code == 201) {
          wx.showToast({
            title: res.data.msg,
            icon: "error"
          })
        } else if (res.data.code == 202) {
          wx.showToast({
            title: res.data.msg,
            icon: "error"
          })
        } else if (res.data.code == 200) {
          wx.showToast({
            title: res.data.msg,
            icon: "success"
          })
          //储存到缓存
          wx.setStorage({
            //储存数据名称
            key: "_token",
            data: res.data.token
          })
          //回到tab栏页面，这里为home页面，1s后触发
          setTimeout(() => {
            wx.switchTab({
              url: '../home/home',
            })
          }, 1000);
        } else {
          wx.showToast({
            title: "其他错误",
            icon: "error"
          })
        }
      }
    })
  },
  //注册层切出
  tanchu() {
    this.setData({
      show: true
    })
  },
  onClose() {
    this.setData({
      show: false
    })
  },

  // 注册
  Register() {
    wx.request({
      url: 'https://kf.webxyq.com/register',
      method: "POST",
      data: {
        appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
        nickName: this.data.regname,
        password: this.data.regpassword,
        phone: this.data.regShouJiHaoData
      }, header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      success: res => {

        console.log(res.data)
        if (res.data.code == 102) {
          wx.showToast({
            title: res.data.msg,
            icon: "error"
          })
        } else if (res.data.code == 100) {
          wx.showToast({
            title: res.data.msg,
            icon: "success"
          })
          this.setData({
            show: false,
            inpShouJiHaoData:this.data.regShouJiHaoData,
            inppassword:this.data.regpassword,
            regShouJiHaoData:"",
            regPssword:""
          })
        } else {
          wx.showToast({
            title: "其他错误",
            icon: "error"
          })
        }
      }
    })
  },
//返回首页
home(){
  wx.switchTab({
    url: '../home/home',
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