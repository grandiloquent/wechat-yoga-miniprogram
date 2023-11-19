use js_sys::Reflect;
use wasm_bindgen::JsValue;

pub fn parse_f64(json: &JsValue, key: &str) -> f64 {
    match Reflect::get(json, &key.into()) {
        Ok(value) => match value.as_f64() {
            Some(value) => value,
            None => return 0.0,
        },
        Err(_err) => return 0.0,
    }
}
