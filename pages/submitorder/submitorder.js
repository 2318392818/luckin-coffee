
Page({
  data: {
    tokenString: "",
    shopbag: [],
    sids: [],
    countGodItems: "",
    countSHuliang: "",
    dizhi: null,
    fullAddress: ""
  },

  onLoad(options) {
    this.setData({ sids: options.sids });
    this.getShopcart();
    this.dizhi();
    this.getToken();
  },

  getToken() {
    wx.getStorage({
      key: "_token",
      success: res => {
        this.setData({ tokenString: res.data });
      }
    });
  },

  tongji() {
    let totalPrice = this.data.shopbag.reduce((sum, item) => {
      return sum + (item.price * item.count || 0);
    }, 0);
    let totalCount = this.data.shopbag.reduce((sum, item) => {
      return sum + (item.count || 0);
    }, 0);
    this.setData({
      countGodItems: totalPrice,
      countSHuliang: totalCount
    });
  },

  processAddress(addressData) {
    if (addressData) {
      const fullAddr = `${addressData.province}${addressData.city}${addressData.county}${addressData.addressDetail}`;
      this.setData({ fullAddress: fullAddr });
      return fullAddr;
    }
    return "";
  },

  dizhi() {
    wx.getStorage({
      key: "_token",
      success: res => {
        wx.request({
          url: 'https://kf.webxyq.com/findAddress',
          method: "GET",
          data: {
            appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
            tokenString: res.data
          },
          success: res => {
            this.setData({ dizhi: res.data.result });
            this.processAddress(res.data.result);
          }
        });
      }
    });
  },

  jiesuan() {
    if (!this.data.dizhi) {
      wx.showToast({ title: '请选择收货地址', icon: 'none' });
      return;
    }
    
    wx.request({
      url: 'https://kf.webxyq.com/pay',
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      data: {
        appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
        tokenString: this.data.tokenString,
        sids: this.data.sids,
        phone: this.data.dizhi.tel,
        address: this.data.fullAddress,
        receiver: this.data.dizhi.name
      },
      success: res => {
          wx.navigateTo({
            url: '../dingdan/dingdan',
          })
        if (res.data.code === 200) {
          wx.showToast({ title: '支付成功' });
        } else {
          wx.showToast({ title: res.data.msg, icon: 'none' });
        }
      }
    });
  },

  getShopcart() {
    wx.getStorage({
      key: "_token",
      success: res => {
        wx.request({
          url: 'https://kf.webxyq.com/findAllShopcart',
          method: "GET",
          data: {
            appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
            tokenString: res.data
          },
          success: res => {
            this.setData({ shopbag: res.data.result });
            this.tongji();
          }
        });
      }
    });
  }
});
