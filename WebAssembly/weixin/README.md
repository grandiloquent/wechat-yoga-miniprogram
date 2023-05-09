# WebAssembly


通过 [wasm-bindgen](https://github.com/rustwasm/wasm-bindgen) 将 Rust 代码编译成 WebAssembly。

```ps
$working="C:\Users\Administrator\Desktop\file\yg\WebAssembly\weixin";$dir="C:\Users\Administrator\Desktop\file\yg\miniprogram\pkg";Set-Location $working;wasm-pack build --target web --out-dir $dir
```