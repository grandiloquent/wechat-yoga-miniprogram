# 瑜伽约课微信小程序

一个专注于瑜伽约课的微信小程序。

## 开发环境

- 微信开发工具
- Go 语言
- PostgreSQL 数据库

## 后端

Windows 系统 PowerShell 终端可使用如下命令启动后端服务器：

```ps
# 使用恰当的参数替换中文描述的内容
$ENV:DATA_SOURCE_NAME="host=数据库公网IP port=数据库侦听端口 user=数据库用户名 password=数据库密码 dbname=数据库名称 sslmode=disable";$ENV:AUTH_URL="https://api.weixin.qq.com/sns/jscode2session?appid=小程序Id&secret=小程序密钥&grant_type=authorization_code&js_code=";$ENV:SECRET="长度32的字符串"; go run main.go
```

## 在线示例

<img src="/images/扫码_搜索联合传播样式-标准色版.png">

## 支持和赞助




