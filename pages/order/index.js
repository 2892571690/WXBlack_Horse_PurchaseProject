/*
1.页面被打开的时候 onShow
  0.onShow 不同于 onLone 无法在形参上接收 options参数
  1判断缓存中有没有token
    1.没有 直接跳转到授权页面
    2.有 直接往下进行
  2.获取url上的参数type
  3.根据type来决定页面标题的数组元素 哪个被激活选中
  4.根据type 去发送请求获取订单数据
  5.渲染页面
2.点击不同的标题 重新发送请求获取和渲染数据
*/
import { request } from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    orders: [],
    tabs: [
      {
        id: 0,
        value: "全部",
        isActive: true
      },
      {
        id: 1,
        value: "待付款",
        isActive: false
      },
      {
        id: 2,
        value: "待发货",
        isActive: false
      },
      {
        id: 3,
        value: "退款/退货",
        isActive: false
      }
    ]
  },
  onShow(options) {
    const token = wx.getStorageSync("token");
    // if(!token){
    //   wx.navigateTo({
    //     url: '/pages/auth/index'
    //   })
    //   return;
    // }
    // 1.获取当前的小程序的页面栈-数组 长度最大是10页面
    let pages = getCurrentPages();
    // 2.数组中 索引最大的页面就是当前页面
    let currentPage = pages[pages.length - 1]
    // 3.获取url上的 type值
    const { type } = currentPage.options
    this.changeTitleByIndex(type - 1)
    this.getOrders(type)
  },
  // 获取订单列表的方法
  async getOrders(type) {
    const res = await request({ url: "/my/orders/all", data: { type } })
    // this.setData({
      // orders:res.orders.map(v=>({...v,create_time_cn:(new Date(v.create_time*1000).toLocaleString())}))
    // })
  },
  // 根据标题 索引来激活选中 标题数组
  changeTitleByIndex(index) {
    let { tabs } = this.data
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
    //3.赋值到data里
    this.setData({
      tabs
    })
  },
  //导航栏点击事件，子组件传过来的值
  handleTabsItemChange(e) {
    //1.获取被点击的标题索引
    let { index } = e.detail
    //2.修改原数组
    this.changeTitleByIndex(index)
    // 3.重新发送请求 type=1 index=0
    this.getOrders(index+1)
  }
})