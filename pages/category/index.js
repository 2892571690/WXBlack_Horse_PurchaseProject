import { request } from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
// pages/category/index.js
Page({
  data: {
    //左侧的菜单数据
    leftMenuList: [],
    //右侧的商品数据
    rightContent: [],
    //被点击的走测菜单
    currentIndex: 0,
    //右侧内容的滚动条距离顶部的距离
    scrollTop: 0
  },
  Cates: [],
  onLoad: function (options) {
    /*
      0.web中的本地储存 小程序中的本地储存的区别
        1.写代码的方式不一样
        web: localStorage.setItem("key","value") localStorage.getItem("ky")
        小程序: wx.setStorageSync("key", "value") wx.getStorageSync("key")
        2.存的时候 有没有做数据类型转换
        web: 不管存入的是什么数据类型，最终都会调用一下 toString(), 把数据变成字符串 在存入进去
        小程序: 不存在 类型转换这个操作 存什么类似的数据进去 获取的时候就是什么类型
      1.先判断一下本地存储中有没有旧数据
      {time:Date.now(),data:[...]}
      2.没有旧数据 直接发送请求
      3.有旧数据 同时 旧数据也没过期 就使用 本地存储中的旧数据即可
    */

    // 1.获取本地存储的数据
    const Cates = wx.getStorageSync("cates");
    // 2.判断
    if (!Cates) {
      // 不存在 发送请求获取数据
      this.getCates()
    } else {
      //有旧的数据 定义过期事件
      if (Date.now() - Cates.time > 1000 * 10) {
        //重新发送请求
        this.getCates()
      } else {
        //可以使用旧数据
        this.Cates = Cates.data
        //构造左侧的大菜单数据
        let leftMenuList = this.Cates.map(v => v.cat_name);
        //构造右侧的商品数据
        let rightContent = this.Cates[0].children
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },
  //获取分类数据
  async getCates() {
    // request({ url: "/categories" })
    //   .then(res => {
    //     this.Cates = res.data.message;

    //     // 把接口数据存储到本地储存里
    //     wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });

    //     //构造左侧的大菜单数据
    //     let leftMenuList = this.Cates.map(v => v.cat_name);
    //     //构造右侧的商品数据
    //     let rightContent = this.Cates[0].children
    //     this.setData({
    //       leftMenuList,
    //       rightContent
    //     })
    //   })

    const res = await request({ url: "/categories" })
    this.Cates = res;

    // 把接口数据存储到本地储存里
    wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });

    //构造左侧的大菜单数据
    let leftMenuList = this.Cates.map(v => v.cat_name);
    //构造右侧的商品数据
    let rightContent = this.Cates[0].children
    this.setData({
      leftMenuList,
      rightContent
    })

  },
  //左侧菜单的点击事件
  handleItemTap(e) {
    const { index } = e.currentTarget.dataset;
    let rightContent = this.Cates[index].children
    this.setData({
      currentIndex: index,
      rightContent,
      //重新设置 右侧内容的scroll—view标签的距离顶部的距离
      scrollTop: 0
    })
  }
})