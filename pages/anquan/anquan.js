// pages/anquan/anquan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false, // 控制弹出层显示
    showEyeOld: false, // 独立控制旧密码眼睛
    showEyeNew: false, // 独立控制新密码眼睛
    oldPassword: "",
    newPassword: "",
    oldPasswordMessage:"",
    newPasswordMessage:""
  },
  // 显示弹出层
  showPopup() {
    this.setData({
      show: true
    });
  },
  // 关闭弹出层
  onClose() {
    this.setData({
      show: false
    });
  },
  // 切换密码可见性
  clickEye(e) {
    const eyeType = e.currentTarget.dataset.eye;
    this.setData({
      [`showEye${eyeType.charAt(0).toUpperCase() + eyeType.slice(1)}`]:
        !this.data[`showEye${eyeType.charAt(0).toUpperCase() + eyeType.slice(1)}`]
    });
  },
  // 退出登录确认
  showLogoutConfirm() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) this.logout();
      }
    });
  },
  // 退出登录逻辑
  logout() {
    wx.removeStorageSync('_token'); // 清除登录令牌
    wx.reLaunch({
      url: '/pages/longin/longin'
    }); // 返回登录页
  },
  inpoldPassword(e) {
    const oldPassword = e.detail;
    console.log("旧密码=>", oldPassword);
    this.setData({
      oldPassword: oldPassword
    })
  },
  inpnewPassword(e) {
    const newPassword = e.detail;
    console.log("新密码=>", newPassword);
    this.setData({
      newPassword: newPassword
    })
  },
  // 修改密码提交
  Modify() {
    const oldPassword = this.data.oldPassword;
    const newPassword = this.data.newPassword;
    const token = wx.getStorageSync('_token');
    // 密码验证
    if (!/^[A-Za-z][A-Za-z0-9_]{5,15}$/.test(oldPassword)) {
      this.setData({
        oldPasswordMessage: "旧密码格式错误"
      })
      return;
    }
    if (!/^[A-Za-z][A-Za-z0-9_]{5,15}$/.test(newPassword)) {
      this.setData({
        oldPasswordMessage: "",
        newPasswordMessage: "新密码格式错误"
      })
      wx.showToast({
        title: '请正确填写!',
        icon: "error"
      })
      return;
    } else {
      this.setData({
        oldPasswordMessage: "",
        newPasswordMessage: ""
      })
      wx.request({
        url: 'https://kf.webxyq.com/updatePassword',
        method: "POST",
        data: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          tokenString: token,
          password: newPassword,
          oldPassword: oldPassword
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        },
        success: res => {
          console.log("res是什么",res);
          // 处理服务器响应
          if (res.data.code === "E001") {
            console.log("状态码",res.data.code)
            wx.showToast({
              title: '修改成功',
              icon: 'success',
              duration: 1500
            });
            // 清空输入框并关闭弹出层
            this.setData({
              show: false,
              oldPassword: '',
              newPassword: ''
            });
            wx.reLaunch({
              url: '/pages/login/login'
            });
          } else {
            // 显示具体的错误信息
            const errorMsg = res.data.msg || '修改失败，请重试';
            wx.showToast({
              title: errorMsg,
              icon: 'none',
              duration: 2000
            });
          }
        },
        fail: err => {
          // 处理网络请求失败
          wx.showToast({
            title: '网络错误，请检查连接',
            icon: 'none'
          });
          console.error('修改密码请求失败:', err);
        }
      });
    }
  },
  // 注销账号处理
  cancelAccount() {
    wx.showModal({
      title: '确认注销',
      content: '确定要永久注销账号吗？',
      success: res => {
        if (res.confirm) {
          // console.log("res是confirm: true",res);
          const token = wx.getStorageSync('_token');
          if (!token) {
            wx.showToast({
              title: '用户未登录!',
              icon: 'none'
            });
            return;
          }
          wx.showLoading({
            title: "正在处理",
          });
          wx.request({
            url: 'https://kf.webxyq.com/destroyAccount',
            method: 'POST',
            data: {
              appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
              tokenString: token
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
            },    
            success: res => {
              wx.hideLoading();
              console.log("是否成功", res);
              if (res.data.code === "G001") {
                wx.removeStorageSync('_token');
                wx.reLaunch({
                  url: '../longin/longin'
                });
              } else {
                wx.showToast({
                  title: res.data.msg || '注销失败',
                  icon: 'none'
                });
              }
            },
            fail() {
              wx.hideLoading();
              wx.showToast({
                title: '网络错误',
                icon: 'none'
              });
            }
          });
        }
      }
    });
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