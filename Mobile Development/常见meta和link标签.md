<!-- MarkdownTOC -->

- [页面基本设置](#%E9%A1%B5%E9%9D%A2%E5%9F%BA%E6%9C%AC%E8%AE%BE%E7%BD%AE)
- [http 信息设置](#http-%E4%BF%A1%E6%81%AF%E8%AE%BE%E7%BD%AE)
- [搜索引擎相关设置](#%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E7%9B%B8%E5%85%B3%E8%AE%BE%E7%BD%AE)
- [移动端开发](#%E7%A7%BB%E5%8A%A8%E7%AB%AF%E5%BC%80%E5%8F%91)
  - [移动开发基本设置](#%E7%A7%BB%E5%8A%A8%E5%BC%80%E5%8F%91%E5%9F%BA%E6%9C%AC%E8%AE%BE%E7%BD%AE)
  - [iOS 图标](#ios-%E5%9B%BE%E6%A0%87)
  - [iOS启动画面](#ios%E5%90%AF%E5%8A%A8%E7%94%BB%E9%9D%A2)
  - [其他常见设置](#%E5%85%B6%E4%BB%96%E5%B8%B8%E8%A7%81%E8%AE%BE%E7%BD%AE)

<!-- /MarkdownTOC -->

## 页面基本设置
```
<!-- 页面描述 -->
<meta name="description" content="页面描述，控制在150字以内" />
<!-- 页面关键词 -->
<meta name="keywords" content="关键字列表" />
<!-- 作者信息 -->
<meta name="author" content="basecss, i@basecss.net" />
<!-- 页面图标 -->
<link rel="shortcut icon" type="image/icon" href="icon.ico" />
```

## http 信息设置
```
<!-- 内容语言 -->
<meta http-equiv="content-language" content="zh-CN" />
<!-- 自动跳转 -->
<meta http-equiv="refresh" content="3; URL=http://www.baidu.com" />
<!-- 编码设置(可以直接用 charset="utf-8" 代替) -->
<meta http-equiv="content-type" content="UTF-8" />
<!-- 缓存信息 -->
<meta http-equiv="expires" content="GMT 格式时间" />
<!-- 禁止缓存 -->
<meta http-equiv="pragma" content="no-cache" />
<!-- 缓存控制 -->
<meta http-equiv="Cache-control" content="max-age=5" />
  <!-- ******************************
  public: 允许任何人缓存此页;
  private: 不允许缓存服务器缓存此页;
  no-cache: 相应不能被缓存;
  no-stroe: 请求相应都不能被缓存;
  max-age: 最大生存周期(秒);
  min-fresh: 客户端愿意接受的最小缓存时长，缓存时间超过该值会要求向服务器查新;
  max-stale: 接受超过缓存时限但不超过该值的数据;
  ******************************* -->
<!-- 添加 cookie -->
<meta http-equiv="set-cookie" content="cookieName=cookieValue;expires=GMT 格式时间;path=/" />
<!-- 页面加载动画 -->
<meta http-equiv="page-enter" content="blandtrans(duration=0.5)" />
<!-- 页面退出动画 -->
<meta http-equiv="page-exit" content="revealtrans(duration=0.5,transtion=1)" />
  <!-- ******************************
  transtion 可以取0-23的整数，分别表示：
  0.盒状收缩; 1.盒状展开; 2.圆形收缩; 3.圆形展开; 4.向上擦除;
  5.向下擦除; 6.向左擦除; 7.向右擦除; 8.垂直百叶窗; 9.水平百叶窗;
  10.纵向棋盘; 11.横向棋盘; 12.溶解; 13.左右向中间收缩; 14.中间向左右展开;
  15.上下向中间收缩; 16.中间向上下展开; 17.阶梯向左下; 18.阶梯向左上;
  19.阶梯向右下; 20.阶梯向右上; 21.水平随机线; 22.垂直随机线; 23.随机;
  ******************************* -->
```

## 搜索引擎相关设置
```
<!-- 设置搜索引擎抓取间隔 -->
<meta name="visit-after" content="10 days">
<!-- 搜索引擎抓取设置 -->
<meta name="robots" content="index, follow" />
  <!-- ******************************
  index: 允许搜索引擎抓取此页;
  noindex: 不允许搜索引擎抓取此页;
  follow: 允许搜索引擎抓取子页面;
  nofollow: 允许搜索引擎抓取子页面;
  none: 等同于 noindex 和 nofollow
  all: 等同于 index 和 follow
  ******************************* -->
```
## 移动端开发

### 移动开发基本设置
```
<!-- 声明文档字符编码 -->
<meta charset="utf-8">
<!-- IE 兼容性设置 -->
<meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1" /> <!-- 用最新模式渲染，优先使用 chrome -->

<!-- 为移动设备设置 viewport -->
<meta name="viewport" content="width=device-width,initial-scale=1, minium-scale=1, user-scalable=no" />
<!-- iOS 移动设备添加主屏幕标题设置 -->
<meta name="apple-mobile-web-app-title" content="My App" />
<!-- 是否启用全屏模式 -->
<meta name="apple-mobile-web-app-capable" content="yes" />
<!-- 全屏时状态栏颜色设置 -->
<meta name="apple-mobile-web-status-bar-style" content="black-translucent" />
<!-- 禁用电话号码自动识别 -->
<meta name="format-detection" content="telephone=no" />
<!-- 禁用邮箱自动识别 -->
<meta name="format-detection" content="email=no" />
<!-- 添加智能 App 广告条 Smart App Banner（iOS 6+ Safari）, 默认禁用 -->
<meta name="apple-itunes-app" content="app-id=myAppStoreID, affiliate-data=myAffiliateData, app-argument=myURL" />
```

### iOS 图标
```
<!-- 非视网膜 iPhone 低于 iOS 7 -->
<link rel="apple-touch-icon" href="icon57.png" sizes="57x57" />
<!-- 非视网膜 iPad 低于 iOS 7 -->
<link rel="apple-touch-icon" href="icon72.png" sizes="72x72" />
<!-- 非视网膜 iPad iOS 7 -->
<link rel="apple-touch-icon" href="icon76.png" sizes="76x76" />
<!-- 视网膜 iPhone 低于 iOS 7 -->
<link rel="apple-touch-icon" href="icon114.png" sizes="114x114" />
<!-- 视网膜 iPhone iOS 7 -->
<link rel="apple-touch-icon" href="icon120.png" sizes="120x120" />
<!-- 视网膜 iPad 低于 iOS 7 -->
<link rel="apple-touch-icon" href="icon144.png" sizes="144x144" />
<!-- 视网膜 iPad iOS 7 -->
<link rel="apple-touch-icon" href="icon152.png" sizes="152x152" />
```

### iOS启动画面
```
<!-- iPad 竖屏 768 x 1004（标准分辨率） -->
<link rel="apple-touch-startup-image" sizes="768x1004" href="/splash-screen-768x1004.png" />
<!-- iPad 竖屏 1536x2008（Retina） -->
<link rel="apple-touch-startup-image" sizes="1536x2008" href="/splash-screen-1536x2008.png" />
<!-- iPad 横屏 1024x748（标准分辨率） -->
<link rel="apple-touch-startup-image" sizes="1024x748" href="/Default-Portrait-1024x748.png" />
<!-- iPad 横屏 2048x1496（Retina） -->
<link rel="apple-touch-startup-image" sizes="2048x1496" href="/splash-screen-2048x1496.png" />
<!-- iPhone/iPod Touch 竖屏 320x480 (标准分辨率) -->
<link rel="apple-touch-startup-image" href="/splash-screen-320x480.png" />
<!-- iPhone/iPod Touch 竖屏 640x960 (Retina) -->
<link rel="apple-touch-startup-image" sizes="640x960" href="/splash-screen-640x960.png" />
<!-- iPhone 5/iPod Touch 5 竖屏 640x1136 (Retina) -->
<link rel="apple-touch-startup-image" sizes="640x1136" href="/splash-screen-640x1136.png" />
```

### 其他常见设置
```
<!-- Windows 8 磁贴颜色 -->
<meta name="msapplication-TileColor" content="#000"/>
<!-- Windows 8 磁贴图标 -->
<meta name="msapplication-TileImage" content="icon.png"/>
<!-- Android 启动图标 -->
<link rel="shortcut icon" sizes="128x128" href="icon.png" />
<!-- 添加 RSS 订阅 -->
<link rel="alternate" type="application/rss+xml" title="RSS" href="/rss.xml" />
<!-- 添加 favicon icon -->
<link rel="shortcut icon" type="image/ico" href="/favicon.ico" />
```
