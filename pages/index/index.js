import { request } from "../../request/index.js"
Page({
  data: {
    //轮播的图片
    swiperList: [],
    //分类导航数据
    cateList:[],
    // 楼层数据
    floorList:[]
  },
  onLoad: function (options) {
    // 异步请求获取 轮播图的图片
    this.getSwiperList()
    // 异步请求获取 分类导航数据
    this.getCateList()
    // 异步请求获取 楼层数据
    this.getFloorList()
  },
  // 请求获取 轮播图的图片
  getSwiperList(){
    request({ url: "/home/swiperdata" })
      .then(result => {
        this.setData({
          swiperList: result
        })
      })
  },
  // 请求 分类导航数据
  getCateList(){
    request({ url: "/home/catitems" })
      .then(result => {
        this.setData({
          cateList: result
        })
      })
  },
  // 请求 楼层数据
  getFloorList(){
    request({ url: "/home/floordata" })
      .then(result => {
        this.setData({
          floorList: result
        })
      })
  }
})