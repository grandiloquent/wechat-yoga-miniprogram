# Rust 服务器

## 运行

Windows 环境下，打开 PowerShell 终端，执行：

```powershell 
$ENV:DB_HOST="数据库主机";$ENV:DB_PORT="数据库端口";$ENV:DB_PASSWORD="数据库密码";cargo run
```

## 配置

通过 Rocket.toml 文件可以修改服务器的各项参数。更多细节请参阅[官方文档](https://rocket.rs/v0.4/guide/configuration/#rockettoml)


