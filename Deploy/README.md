一个使用 Rust 编写的，用于部署该微信小程序后端服务器的命令行工具。

在 Windows 环境下可以通过执行下列 PowerShell 命令运行该程序 ：

```ps
$ENV:ADDR="服务器公网IP:22";$ENV:USERNAME="用户名";$ENV:PASSWORD="登录密码";cargo run
```

## 安装 Rust

1. 打开 Visual Studio Code 安装 [Remote - SSH](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh) 扩展
2. 点击左侧工具栏的 **远程资源管理器**，然后单击左侧栏上端的 **+** 图标新建一个远程连接
3. 打开 Visual Studio Code 安终端，执行命令：

    ```
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
    ```

    更多信息请查询官方网站 https://www.rust-lang.org/tools/install

## 自动启动

## 代理服务器

