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
        let start_time = Reflect::get(&json, &"start_time".into())
            .unwrap()
            .as_f64()
            .unwrap();
        let now = Date::new(&JsValue::from_f64((date_time) * 1000f64));
        let obj = Object::from(json);

        let time = if start_time > (12f64 * 3600f64) {
            "晚上"
        } else {
            "上午"
        };
        let _ = Reflect::set(
            &obj,
            &"date".into(),
            &JsValue::from_str(
                format!("{}月{}日{}", now.get_month() + 1, now.get_date(), time).as_str(),
            ),
        );
        page.set_data(obj);
    } else {
        let obj = Object::new();
        let _ = Reflect::set(&obj, &"students".into(), &JsValue::from_str(""));
        page.set_data(obj);
    }
    Ok(())
}
// 因节假日或其他原因，需要取消原来排定的
// 课程时，可通过将课程的 hidden
// 字段设置为 1 来隐藏该课程。同时，我
// 们应该以某种方式提前通知该课程的老师
// 和已预约的学员，且在计算费用时，应该
// 排除该课程，我们还应该记录取消该课程
// 的原因。
#[wasm_bindgen]
pub async fn suspend_lesson(
    base_uri: &str,
    id: u32,
    status: u32,
    openid: String,
) -> Result<JsValue, JsValue> {
    get_json(
        format!(
            "{}/yoga/admin/lesson/hidden?id={}&status={}&openid={}",
            base_uri, id, status, openid
        )
        .as_str(),
    )
    .await
}
