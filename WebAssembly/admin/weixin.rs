[package]
edition = "2021"
name = "admin"
version = "0.1.0"

# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[lib]
crate-type = ["cdylib"]

[dependencies]
js-sys = "0.3.61"
wasm-bindgen = "0.2.84"
wasm-bindgen-futures = "0.4.34"

