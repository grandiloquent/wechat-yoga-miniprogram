use js_sys::{Date, Object, Reflect};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    pub fn log(s: &str);
    #[wasm_bindgen(catch, js_name = "getJson",js_namespace = shared)]
    pub async fn get_json(s: &str) -> Result<JsValue, JsValue>;
    #[wasm_bindgen(catch, js_name = "postData",js_namespace = shared)]
    pub async fn post_data(url: &str, data: &str) -> Result<JsValue, JsValue>;
    pub type Page;
    #[wasm_bindgen(method, js_name = "setData")]
    pub fn set_data(this: &Page, obj: Object);
}
// 查询课程的基本信息和预约该课程
// 的学员列表。在服务端将接受到
// 的课程标识和用户标识直接发送
// 给数据库，数据库使用用户标识
// 通过查询用户表检查用户的权限
// ，然后以 JSON 格式返回
// 查询结果
#[wasm_bindgen]
pub async fn query_lesson(
    page: &Page,
    base_uri: &str,
    id: u32,
    openid: String,
) -> Result<(), JsValue> {
    let json =
        get_json(format!("{}/yoga/admin/lesson?id={}&openid={}", base_uri, id, openid).as_str())
            .await?;
    if json.is_object() {
        let date_time = Reflect::get(&json, &"date_time".into())
            .unwrap()
            .as_f64()
            .unwrap();
        start_time
        date_time
        let date_time = Reflect::get(&json, &"date_time".into())
            .unwrap()
            .as_f64()
            .unwrap();
        let obj = Object::from(json);
        page.set_data(obj);
    } else {
        let obj = Object::new();
        let _ = Reflect::set(&obj, &"lesson".into(), &JsValue::from_str(""));
        page.set_data(obj);
    }
    Ok(())
}
