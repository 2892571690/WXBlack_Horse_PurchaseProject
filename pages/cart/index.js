/*
1.获取用户的收货地址
  1.绑定事件
  2.(行不通!!!!!!)调用小程序内置的api 获取用户的收货地址 wx.chooseAddress

  2.获取 用户 对小程序 所授予 回去地址的权限 状态 scope
    1.假设 用户 点击获取收获地址的提示框 确定 authSetting scope.address
      scope 的值为 true 直接调用 获取收获地址
    2.假设 用户 从来没调用过 收获地址的api
      scope 的值为 undefined 直接调用 获取收货地址
    3.假设 用户 点击获取收获地址的提示框 取消
      scope 的值为 false 
      1.诱导用户 自己打开 授权设置管理(wx.openSetting) 到用户重新给予 获取地址权限的时候
      2.获取收获地址
    4.把获取到的收货地址存入到 本地存储中
2.页面加载完毕
  0.onLoad onShow
  1.获取本地储存中的地址数据
  2.把数据 设置给data中的一个变量
3.onShow
  0.回到了商品详情页面 第一次添加商品的时候 手动添加了属性
    1.num = 1
    2.checked = true
  1.获取缓存中的购物车数组
  2.把购物车数据 填充到data中
4.全选的实现 数据的展示
  1.onShow 获取缓存中的购物车数据
  2.根据购物车中的商品数据 所有的商品都被选中 checked = true 全选就被选中
5.总价格和总数量
  1.都需要商品被选中 我们才能那它来计算
  2.获取购车数组
  3.遍历
  4.判断商品是否被选中
  5.总价格 += 商品的单价 * 商品的数量
  6.总数量 += 商品的数量
  7.把计算后的价格和数量 设置会data中即可
6.商品的选中
  1.绑定change事件
  2.获取到被修改的商品对象
  3.商品对象的选中状态 取反
  4.重新填充回 data 中和 缓存 中
  5.重新计算全选 总价格 总数量
7.全选和取反
  1.全选复选框绑定事件 change
  2.获取 data 中的全选变量 allChecked
  3.直接取反 allChecked = !allChecked
  4.遍历购物车数组 让里面 商品 选中状态跟随 allChecked 改变而改变
  5.把购物车数组 和 allChecked 重新设置回data 把购物车重新设置 缓存中
8.商品数量的编辑
  1.“+” “-” 按钮 绑定同一个点击事件 区分的关键 自定义属性
    1.“+” “+1”
    2.“-” “-1”
  2.传递被点击的商品id goods_id
  3.获取data中的购物车数组 来获取需要被修改的商品对象
  4.当 购物车的数量 =1 同时 用户点击 -
    1.弹窗提示(showModal) 询问用户是否删除
    2.确定 执行删除
    3.取消 什么都不做
  5.直接修改商品对象的数量 num
  6.把cart数组 重新设置回 缓存中 和 data 中的this.setCart
9.点击结算
  1.判断有没有收货地址信息
  2.判断用户有没有勾选商品
  3.经过以上验证 跳转到支付页面
*/
import { getSetting, chooseAddress, openSetting, showModal, showToast } from "../../utils/asyncWX.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    // 1.获取缓存中的收货地址信息
    const address = wx.getStorageSync("address");
    // 1.获取缓存中的购物车的数据
    const cart = wx.getStorageSync("cart") || [];

    this.setData({ address })
    // 计算购物车的全选 总价格 购买的数量 函数
    this.setCart(cart)
  },
  //  点击 获取地址
  async handleChooseAddress() {
    try {
      // 1.获取 权限状态
      let res1 = await getSetting()
      const scopeAddress = res1.authSetting["scope.address"];
      // 2.判断 权限状态
      if (scopeAddress === false) {
        // 4.诱导用户打开授权页面
        await openSetting()
      }
      // 3.调用获取收获地址的api
      let address = await chooseAddress()
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo
      // 5.把获取到的收货地址存入到 本地存储中
      wx.setStorageSync("address", address);
    } catch (error) {
      console.log(error)
    }
  },
  // 商品的选中
  handleItemChange(e) {
    // 1.获取被修改的商品id
    let goods_id = e.currentTarget.dataset.id;
    // 2.获取购物车数组
    let { cart } = this.data;
    // 3.找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id);
    // 4.选中状态取反
    cart[index].checked = !cart[index].checked;

    // 计算购物车的全选 总价格 购买的数量 函数
    this.setCart(cart)
  },
  // 设置购物车状态同时 重新计算 底部工具栏的数据 全选 总价格 购买的数量
  setCart(cart) {
    // 1.计算全选
    // every 数据方法 会遍历 会接收一个回调函数 那么 每一个回调函数都返回true 那么every方法的返回值是true
    // 只要 有一个回调函数返回false 那么不在循环执行 直接false
    // const allChecked = cart.length ? cart.every(v => v.checked) : false;
    let allChecked = true
    // 1.总价格和总数量
    let totalPrice = 0
    let totalNum = 0
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num
      } else {
        allChecked = false
      }
    })
    //判断数组是否为空
    allChecked = cart.length != 0 ? allChecked : false
    // 5 6 把购物车数据重新设置会data中和缓存中
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    })
    wx.setStorageSync("cart", cart)
  },
  // 商品全选功能
  handleItemAllChecked() {
    // 1.获取data的数据
    let { cart, allChecked } = this.data;
    // 2.修改值
    allChecked = !allChecked;
    // 3.循环修改cart数组 中的商品选中状态
    cart.forEach(v => v.checked = allChecked);
    // 4.把修改的值 填充回data或者缓存中
    this.setCart(cart)
  },
  // 商品数量的编辑
  async handleItemNumEdit(e) {
    // 1.获取传递过来的参数
    const { operation, id } = e.currentTarget.dataset;
    // 2.获取购物车数组
    let { cart } = this.data
    // 3.找到需要修改的商品的索引
    const index = cart.findIndex(v => v.goods_id === id)
    // 4.判断是否执行删除
    if (cart[index].num === 1 && operation === -1) {
      // 4.1弹窗提示
      const res = await showModal({ content: '宝贝,你要把我删除吗？' })
      if (res.confirm) {
        cart.splice(index, 1)
        this.setCart(cart)
      }
    } else {
      // 5.进行修改数量
      cart[index].num += operation
      // 6.设置回缓存和data中
      this.setCart(cart)
    }
  },
  // 点击结算
  async handlePay(){
    // 1.判断收货地址
    const {address,totalNum} = this.data;
    if(!address.userName){
      await showToast({title:"宝贝,我不知道你的住址哦!"})
      return;
    }
    // 2.判断用户有没有选购商品
    if(totalNum === 0){
      await showToast({title:"宝贝,我购物车没有商品哦!"})
      return;
    }
    // 3.跳转到 支付页面
    wx.navigateTo({
      url: '/pages/pay/index'
    });
  }
})