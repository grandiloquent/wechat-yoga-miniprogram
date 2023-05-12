# 瑜伽约课微信小程序

瑜伽约课工具是一个使用 Rust 开发的微信小程序。

- [部署](/Deploy)
- [后端服务器](/server)
- [前端](/WebAssembly/weixin)

## 微信小程序截图

<div>
<img width="250" src="images/Screenshot_2022-12-29-12-52-48-957_com.tencent.mm.jpg">
<img width="250" src="images/Screenshot_2022-12-29-12-52-52-502_com.tencent.mm.jpg">
<img width="250"  src="images/Screenshot_2022-12-29-12-53-05-122_com.tencent.mm.jpg">
<img width="250" src="images/Screenshot_2022-12-29-12-53-28-806_com.tencent.mm.jpg">
<img width="250" src="images/Screenshot_2022-12-29-12-53-18-957_com.tencent.mm.jpg">
</div>

## 开发环境

- 微信开发工具
- Rust 语言
- PostgreSQL 数据库

## 安装和配置

安装和配置小程序的详细步骤，请参见[说明文档](https://lucidu.cn/article?name=%E5%AE%89%E8%A3%85%E5%92%8C%E9%85%8D%E7%BD%AE)。

## 后端

Windows 系统 PowerShell 终端可使用如下命令启动后端服务器：

```ps
# 使用恰当的参数替换中文描述的内容
$ENV:DATA_SOURCE_NAME="host=数据库公网IP port=数据库侦听端口 user=数据库用户名 password=数据库密码 dbname=数据库名称 sslmode=disable";$ENV:AUTH_URL="https://api.weixin.qq.com/sns/jscode2session?appid=小程序Id&secret=小程序密钥&grant_type=authorization_code&js_code=";$ENV:SECRET="长度32的字符串"; go run main.go
```

## 前端

在开发前端的过程中，最让人困扰和影响代码质量的，莫过于需要频繁查询特定HTML元素，然后要命名一个相关变量，最后还要绑定它的如鼠标单击的特种事件。我们将通过几行代码来解决这些问题。

```html
  <custom-drawer bind="customDrawer"></custom-drawer>
  <custom-header title="瑜伽" bind @click="showDrawer"></custom-header>
```

我们用 `bind` 属性来标记元素，然后用该属性的值作为 `window` 对象的变量缓存该元素。例如 `window['customDrawer']`。

我们用  `@` 作为前缀，来绑定元素的事件。而实现这种规则的代码如下。

```javascript
document.querySelectorAll('[bind]').forEach(element => {
  if (element.getAttribute('bind')) {
    window[element.getAttribute('bind')] = element;
  }
  [...element.attributes].filter(attr => attr.nodeName.startsWith('@')).forEach(attr => {
    if (!attr.value) return;
    element.addEventListener(attr.nodeName.slice(1), evt => {
      window[attr.value](evt);
    });
  });
})

```

更多内容请查阅[在线文档](https://lucidu.cn/article?name=%E5%89%8D%E7%AB%AF)。

## 在线示例

<img src="/images/扫码_搜索联合传播样式-标准色版.png">

## 待解决事项

- 某些图标在高清屏幕下锯齿，例如底部栏的约课图标

    <img src="/images/image.png">
- 执行用户约课候补
- 团课图标线条过粗，应通过路径偏移减少 4 个像素
- 预约课程页面天数偏移不应初始化为-1，否则会导致显示错误


## 相关文档

- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link

## 支持和赞助

```
$dir="C:\Users\Administrator\Desktop\file\yg\server\src";$name="models";$filename="settings.rs";Set-Location $dir;New-Item -Type "directory" $name;Set-Location $name; New-Item mod.rs;New-Item $filename;Get-ChildItem | Where-Object {$_.Name -ne "mod.rs"} | Split-Path -LeafBase | Join-String -FormatString "pub mod {0};`r`n" | Set-Content -Path .\mod.rs;` 

$name="adminLessons";$dir="C:\Users\Administrator\Desktop\file\yg\miniprogram\pages";Set-Location $dir;New-Item -Type "directory" $name;Set-Location $name;New-Item $name".js";New-Item $name".wxml";New-Item $name".wxss";New-Item $name".json";
```