//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  onLaunch(options) {
    //在页面加载进来的时候，直接声明全局变量，把小程序链接中的参数拿出来声明
    var openid = options.query.openid;
    var mch_id = options.query.mch_id;
    if (openid && mch_id) {
      this.globalData.openid = options.query.openid;
      this.globalData.mch_id = options.query.mch_id;
    }

  },
  //必须在onShow这调起定位插件
  onShow: function () {
    var myPluginInterface = requirePlugin('myPlugin');

    //这里必须要引入定位模块，且要带着openid
    myPluginInterface.getLocation(this.globalData.openid).then(res => {
      // 如果传入openid正确，则return_code == 0,否则无法使用支付即积分小程序
      if (res.return_code !== 0) {
        wx.showModal({
          title: '提示',
          content: 'openid参数错误！',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    })
  },
  //声明全局变量
  globalData: {
    userInfo: null,
    openid: '',
    mch_id: ''
  }
})