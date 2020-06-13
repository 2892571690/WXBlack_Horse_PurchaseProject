/*
1.输入框绑定 值改变事件 input事件
  1.获取到输入框的值
  2.合法性判断 
  3.检验通过 把输入框的值 发送到后台
  4.返回的数据打印到页面上
2.防抖(防止抖动) 定时器
  1.防抖 一般 输入框中 防止重复输入 重复发送请求
  2.节流 一般是用在页面下拉和上拉
  3.定义全局的定时器id

*/
import { request } from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    goods:[],
    // 取消按钮 是否显示
    isFocus:false,
    // 输入框的值
    inputValue:""
  },
  Timeid:-1,
  // 输入框值改变 就会触发的事件
  handleInput(e){
    // 1.获取输入框的值
    const {value} = e.detail;
    // 2.检验合法性
    if(!value.trim()){
      // 值不合法
      this.setData({
        goods:[],
        isFocus:false
      })
      return;
    }
    this.setData({
      isFocus:true
    })
    // 3.准备发送请求获取数据
    clearTimeout(this.Timeid)
    this.Timeid = setTimeout(() => {
      this.qsearch(value)
    }, 1000);
  },
  // 发送请求获取搜索建议 数据
  async qsearch(query){
    const res = await request({url:"/goods/qsearch",data:{query}})
    this.setData({
      goods:res
    })
  },
  // 点击取消按钮 清空页面
  handleIsFocus(){
    this.setData({
      isFocus:false,
      goods:[],
      inputValue:""
    })
  }
})