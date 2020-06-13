// pages/login/index.js
Page({
  handleGetuserinfo(e) {
    console.log(e)
    const { userInfo } = e.detail
    wx.setStorageSync("userInfo", userInfo);
    wx.navigateBack({
      delta: 1
    });
  }
})