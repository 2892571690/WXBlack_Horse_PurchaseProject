import { request } from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
import { login,showToast } from "../../utils/asyncWX.js"
Page({
  // 这是授权
  // async handleGetUserInfo(e) {
  //   try {
  //     // 1.获取用户信息
  //     const { encryptedData, rawData, iv, signature } = e.detail;
  //     // 2.获取小程序登陆后的code
  //     const { code } = await login()
  //     const loginParams = { encryptedData, rawData, iv, signature, code }
  //     // 3.发送请求 获取用户的token
  //     const { token } = await request({ url: "/users/wxlogin", data: loginParams, method: "POST" })
  //     // 4.把token存入缓存中
  //     wx.setStorageSync('token', token);
  //     wx.navigateBack({
  //       delta: 1
  //     });
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  // 这不是授权,瞎写的
  async handleGetUserInfo(){
    await showToast({title:"目前不是企业号,不能获取token"})
  }
})