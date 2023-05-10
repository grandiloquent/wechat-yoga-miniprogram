一个使用 Rust 编写的，用于部署该微信小程序后端服务器的命令行工具。

在 Windows 环境下可以通过运行下面的代码运行该称程序：

```ps
$ENV:ADDR="服务器公网IP:22";$ENV:USERNAME="用户名";$ENV:PASSWORD="登录密码";cargo run
```