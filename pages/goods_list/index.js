/*
1.用户上滑页面 滚动条触底 开始加载下一页数据
  1.找到滚动条触底事件 onReachBottom
  2.判断还有没有下一页数据
    1.获取到总页数  只有总条数
    总页数 = Math.ceil(总条数 / 页容量)
    总页数 = Math.ceil(23 / 10) = 3
  3.假如没有下一页数据 弹出一个提示
  4.假如还有下一页数据 来加载下一页数据
    1.当前页码++
    2.重新发送请求
    3.数据请求回来 要对data中的数组 进行拼接
2.下拉刷新新页面
  1.触发下拉事件
    找到 触发下拉刷新的事件
  2.重置 数据 数组
  3.重置页码 设置为1
  4.重新发送一次请求
  5.数据回来了 需要手动的关闭 等待效果
*/

import { request } from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    tabs: [
      {
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    goodsList: []
  },
  //接口要的参数
  QueryParams: {
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10
  },
  //总页数
  totalPages: 1,
  onLoad: function (options) {
    this.QueryParams.cid = options.cid||'';
    this.QueryParams.query = options.query||'';
    this.getGoodsList()
  },
  //获取商品列表数据
  async getGoodsList() {
    const res = await request({ url: "/goods/search", data: this.QueryParams })
    //获取 总条数
    const { total } = res
    //计算总页数
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize)

    this.setData({
      goodsList: [...this.data.goodsList, ...res.goods]
    })
    //关闭下拉刷新的窗口
    wx.stopPullDownRefresh()
  },
  //导航栏点击事件，子组件传过来的值
  handleTabsItemChange(e) {
    //1.获取被点击的标题索引
    let { index } = e.detail
    //2.修改原数组
    let { tabs } = this.data
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
    //3.赋值到data里
    this.setData({
      tabs
    })
  },
  //页面上滑 滚动条触底事件
  onReachBottom() {
    // 1.判断还有没有下一页数据
    if(this.QueryParams.pagenum >= this.totalPages){
      //没有下一页
      wx.showToast({title: '我下面没有数据了哦',});
        
    }else{
      //还有下一页
      this.QueryParams.pagenum ++;
      this.getGoodsList()
    }
  },
  //下拉刷新事件
  onPullDownRefresh(){
    // 1.重置数组
    this.setData({
      goodsList:[]
    })
    // 2.重置页码
    this.QueryParams.pagenum = 1
    // 3.发送请求
    this.getGoodsList()
  }
})