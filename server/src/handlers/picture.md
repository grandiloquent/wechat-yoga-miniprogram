```
$file="picture";$dir="C:\Users\Administrator\Desktop\file\yg\server\src\handlers";Set-Location $dir;New-Item $file".rs";New-Item $file".md";Get-ChildItem | Where-Object {$_.Name -ne "mod.rs"} | Split-Path -LeafBase | Join-String -FormatString "pub mod {0};`r`n" | Set-Content -Path .\mod.rs
```

```
Host: localhost:8002
Connection: keep-alive
Content-Length: 2889
Content-Type: multipart/form-data; boundary=--------------------------197359866801175071927772
Referer: https://servicewechat.com/wx915afa9083177059/devtools/page-frame.html
User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.3 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1 wechatdevtools/1.06.2303060 MicroMessenger/8.0.5 Language/zh_CN webview/

----------------------------197359866801175071927772
Content-Disposition: form-data; name="images"; filename="2x9WrEAEpU2H76cde8ccf1f73315156eabb5b578c03e.jpeg"
Content-Type: image/jpeg
```