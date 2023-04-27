use wasm_bindgen::prelude::*;
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    pub fn log(s: &str);
    #[wasm_bindgen(catch, js_name = "getString",js_namespace = shared)]
    pub async fn get_string(s: &str) -> Result<JsValue, JsValue>;
}
#[wasm_bindgen]
pub fn start() {
    log("start");
    // spawn_local
    wasm_bindgen_futures::spawn_local(async move {
        let s = get_string("").await.unwrap();
        log(format!("{}", s.as_string().unwrap()).as_str());
    });
}
/*

Set-Location C:\Users\Administrator\WeChatProjects\yg\WebAssembly\weixin;wasm-pack build --target web --out-dir C:\Users\Administrator\WeChatProjects\yg\utils

 */
