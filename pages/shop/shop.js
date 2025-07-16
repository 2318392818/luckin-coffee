Page({
  data: {
    isLongin: null,
    tokenString: "",
    shopbag: [],
    totalPrice: 0,
    selectAll: false,
    counts: "",
    sid: null,
    sids: [],
    isEditMode: false
  },

  // 检测登录状态
  judgeLogin() {
    wx.getStorage({
      key: "_token",
      success: res => {
        this.setData({
          isLongin: !!res.data,
          tokenString: res.data || ""
        });
        // 登录贼获取购物车数据
        this.getShopcart();
      },
      fail: () => {
        this.setData({
          isLongin: false
        });
      }
    });
  },
  // 获取购物车数据
  getShopcart() {
    wx.request({
      url: 'https://kf.webxyq.com/findAllShopcart',
      method: "GET",
      data: {
        appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
        tokenString: this.data.tokenString,
      },
      success: res => {
        if (Array.isArray(res.data.result)) {
          const shopbag = res.data.result.map(item => ({
            ...item,
            checked: false,
          }));
          this.setData({
            shopbag
          });
          this.calculateTotal();
        }
      }
    });
  },
  // 数量步进器
  onStepperChange(e) {
    const index = e.currentTarget.dataset.index;
    const newValue = e.detail;
    console.log(e.currentTarget.dataset.sid);
    this.setData({
      counts: e.detail,
      sid: e.currentTarget.dataset.sid
    })
    this.updateCartItem()
  },

  updateCartItem() {
    wx.request({
      url: 'https://kf.webxyq.com/modifyShopcartCount',
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      data: {
        appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
        tokenString: this.data.tokenString,
        sid: this.data.sid,
        count: this.data.counts
      },
      success: res => {
        console.log("添加购物车测试", res);
      }
    });
  },

  toggleCheck(e) {
    const {
      index,
      sid
    } = e.currentTarget.dataset;
    const {
      shopbag
    } = this.data;
    shopbag[index].checked = !shopbag[index].checked;
    console.log("复选框测试", e.currentTarget.dataset);

    // 获取当前选中的sid数组
    let selectedSids = shopbag.filter(item => item.checked).map(item => item.sid);

    this.setData({
      shopbag,
      selectAll: shopbag.length > 0 && shopbag.every(item => item.checked),
      sids: JSON.stringify(selectedSids)
    });
    console.log("数组测试:", this.data.sids);
    this.calculateTotal();
  },
//检测复选框是否全选
  onSelectAllChange(e) {
    const checked = e.detail;
    const shopbag = this.data.shopbag.map(item => ({
      ...item,
      checked
    }));

    let selectedSids = checked ? this.data.shopbag.map(item => item.sid) : [];

    this.setData({
      shopbag,
      selectAll: checked,
      sids: JSON.stringify(selectedSids)
    });
    this.calculateTotal();
  },
//计算价格
  calculateTotal() {
    const total = this.data.shopbag
      .filter(item => item.checked)
      .reduce((sum, item) => sum + (item.price * item.count), 0);

    this.setData({
      totalPrice: total * 100
    }); // 以分为单位
  },

  // 点击编辑后切换成删除状态
  qiehuan() {
    const newEditMode = !this.data.isEditMode;
    this.setData({
      isEditMode: newEditMode,
      // 退出编辑模式时重置所有复选框状态
      shopbag: newEditMode ? this.data.shopbag : this.data.shopbag.map(item => ({
        ...item,
        checked: false
      })),
      selectAll: false,
      sids: []
    });
    this.calculateTotal();
  },
  deleteSelected() {
    if (this.data.sids.length === 0) {
        wx.showToast({
            title: '请选择要删除的商品',
            icon: 'none'
        });
        return;
    }
    wx.showModal({
        title: '提示',
        content: '确定要删除选中的商品吗？',
        success: (res) => {
            if (res.confirm) {
                wx.request({
                    url: 'https://kf.webxyq.com/deleteShopcart',
                    method: "POST",
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
                    },
                    data: {
                        appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
                        tokenString: this.data.tokenString,
                        sids: this.data.sids 
                    },
                    success: res => {
                        if (res.data.code === 70000) {
                            wx.showToast({
                                title: '删除成功'
                            });
                            // 在这里确保删除成功后刷新数据
                            this.setData({
                                isEditMode: false,
                                sids: []
                            }); // 退出编辑模式并清空选中的sids
                            this.getShopcart(); // 确保在删除成功后调用
                        } else {
                            wx.showToast({
                                title: res.data.msg,
                                icon: 'none'
                            });
                            console.log("删除测试:", res);
                        }
                    }
                });
            }
        }
    });
},

  onClickButton() {
    const selectedItems = this.data.shopbag.filter(item => item.checked);
    if (selectedItems.length === 0) {
      wx.showToast({
        title: '请选择商品',
        icon: 'none'
      });
      return;
    }
    // 这里添加提交订单逻辑
    wx.navigateTo({
      url: `../submitorder/submitorder?sids=${this.data.sids}`
    });
  },

  goLongin() {
    wx.navigateTo({
      url: '../longin/longin',
    })
  },

  goHome() {
    wx.switchTab({
      url: '/pages/home/home'
    });
  },
  onLoad() {
    this.getShopcart()
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
    this.judgeLogin(),
    this.getShopcart()
    this.setData({
      // 退出编辑模式时重置所有复选框状态
      shopbag:this.data.shopbag.map(item => ({
        ...item,
        checked: false
      })),
      selectAll: false,
      sids: []
    });
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