use chinese_lunisolar_calendar::chrono::prelude::*;
use chinese_lunisolar_calendar::LunisolarDate;
use js_sys::{Date, Object, Reflect};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    pub fn log(s: &str);
    // 绑定用 Promise 封装的 wx.request
    // 函数。wasm_bindgen
    // 会生成一个胶水文件，将
    // 调用的结果字节化然后传入 WebAs-
    // sembly 进行处理。我们通过将封
    // 装的函数写入一个 shared.js，
    // 然后再将此文件导入生成胶水文件来实
    // 现绑定。
    #[wasm_bindgen(catch, js_name = "getJson",js_namespace = shared)]
    pub async fn get_json(s: &str) -> Result<JsValue, JsValue>;
    #[wasm_bindgen(catch, js_name = "getLoginCode",js_namespace = shared)]
    pub async fn get_login_code() -> Result<JsValue, JsValue>;
    #[wasm_bindgen(catch, js_name = "postData",js_namespace = shared)]
    pub async fn post_data(url: &str, data: &str) -> Result<JsValue, JsValue>;
    pub type Page;
    #[wasm_bindgen(method, js_name = "setData")]
    pub fn set_data(this: &Page, obj: Object);
}
#[wasm_bindgen]
pub async fn beijing_time() -> Result<JsValue, JsValue> {
    let json =
        get_json("https://api.m.taobao.com/rest/api3.do?api=mtop.common.getTimestamp").await?;
    if json.is_object() {
        let data = Reflect::get(json.as_ref(), &"data".into())?;
        let t = Reflect::get(data.as_ref(), &"t".into())?;
        return Ok(t);
    }
    Err("")?
}

// 获取当天的农历
#[wasm_bindgen]
pub fn lunar_time() -> String {
    let now = Date::new_0();

    let lunisolar_date = LunisolarDate::from_naive_date(
        NaiveDate::from_ymd_opt(
            now.get_full_year() as i32,
            now.get_month() + 1,
            now.get_date(),
        )
        .unwrap(),
    )
    .unwrap();
    format!(
        "农历 {}{}",
        lunisolar_date.get_lunar_month(),
        lunisolar_date.get_lunar_day()
    )
}

// 通过调用腾讯天气接口查询长沙市的实时
// 天气状况
#[wasm_bindgen]
pub async fn get_weather() -> Result<String, JsValue> {
    let json =
        get_json("https://wis.qq.com/weather/common?source=xw&refer=h5&weather_type=observe&province=%E6%B9%96%E5%8D%97%E7%9C%81&city=%E9%95%BF%E6%B2%99%E5%B8%82").await?;
    if json.is_object() {
        let data = Reflect::get(json.as_ref(), &"data".into())?;
        let observe = Reflect::get(data.as_ref(), &"observe".into())?;
        let weather = Reflect::get(observe.as_ref(), &"weather".into())?;
        let degree = Reflect::get(observe.as_ref(), &"degree".into())?;
        let wind_power = Reflect::get(observe.as_ref(), &"wind_power".into())?;
        let wind_direction = Reflect::get(observe.as_ref(), &"wind_direction".into())?;

        let wind_direction = match wind_direction.as_string().unwrap().as_str() {
            "0" => "微风",
            "1" => "东北风",
            "2" => "东风",
            "3" => "东南风",
            "4" => "南风",
            "5" => "西南风",
            "6" => "西风",
            "7" => "西北风",
            "8" => "北风",
            "9" => "旋转风",
            _ => "",
        };

        return Ok(format!(
            "长沙市 {}{}° {}{}级",
            // 天气
            weather.as_string().unwrap(),
            // 温度
            degree.as_string().unwrap(),
            // 风向
            wind_direction,
            // 风力
            wind_power.as_string().unwrap(),
        ));
    }
    Err("")?
}

// #[wasm_bindgen]
// pub async fn get_open_id(base_uri: &str) -> Result<String, JsValue> {
//     let code = get_login_code().await?;
//     let json =
//         get_json(format!("{}/yoga/auth?code={}", base_uri, code.as_string().unwrap()).as_str())
//             .await?;
//     // {"session_key":"XgFKF\/6n0ZSdBK3UaGC+Ng==","openid":"oQOVx5Dxk0E6NQO-Ojoyuky2GVR8"}
//     if json.is_object() {
//         let openid = Reflect::get(json.as_ref(), &"openid".into())?;
//         return Ok(openid.as_string().unwrap());
//     }
//     Err("")?
// }
#[wasm_bindgen]
pub async fn book(base_uri: &str, id: i32, openid: String) -> Result<String, JsValue> {
    let json =
        get_json(format!("{}/yoga/book?id={}&openid={}", base_uri, id, openid).as_str()).await?;
    match json.as_f64() {
        Some(v) => Ok(v.to_string()),
        None => Err("")?,
    }
}
#[wasm_bindgen]
pub async fn unbook(base_uri: &str, id: i32, openid: String) -> Result<String, JsValue> {
    let json =
        get_json(format!("{}/yoga/unbook?id={}&openid={}", base_uri, id, openid).as_str()).await?;
    match json.as_f64() {
        Some(v) => Ok(v.to_string()),
        None => Err("")?,
    }
}
// #[wasm_bindgen]
// pub async fn debug(base_uri: &str, data: String) -> Result<String, JsValue> {
//     let json = post_data(format!("{}/yoga/debug", base_uri).as_str(), data.as_str()).await?;
//     match json.as_f64() {
//         Some(v) => Ok(v.to_string()),
//         None => Err("")?,
//     }
// }
#[wasm_bindgen]
pub async fn user_query(base_uri: &str, openid: String) -> Result<JsValue, JsValue> {
    get_json(format!("{}/yoga/user/query?openid={}", base_uri, openid).as_str()).await
}

// #[wasm_bindgen]
// pub async fn bind_index(base_uri: &str, page: &Page) -> Result<String, JsValue> {
//     let json = get_json(format!("{}/yoga/index", base_uri).as_str()).await?;
//     if json.is_object() {
//         let data = js_sys::Object::new();
//         let booked = Reflect::get(json.as_ref(), &"booked".into())?;
//         Reflect::set(&data, &"booked".into(), &booked).unwrap();
//         let poster = Reflect::get(json.as_ref(), &"poster".into())?;
//         Reflect::set(&data, &"poster".into(), &poster).unwrap();
//         let actions = Reflect::get(json.as_ref(), &"actions".into())?;
//         Reflect::set(&data, &"actions".into(), &actions).unwrap();
//         let market = Reflect::get(json.as_ref(), &"market".into())?;
//         Reflect::set(&data, &"market".into(), &market).unwrap();
//         let notices = Reflect::get(json.as_ref(), &"notices".into())?;
//         Reflect::set(&data, &"notices".into(), &notices).unwrap();
//         let teachers = Reflect::get(json.as_ref(), &"teachers".into())?;
//         Reflect::set(&data, &"teachers".into(), &teachers).unwrap();
//         page.set_data(data);
//     }
//     Err("")?
// }
#[wasm_bindgen]
pub async fn user_book_statistics(base_uri: &str, openid: String)  -> Result<JsValue, JsValue> {
     get_json(format!("{}/yoga/user/book/statistics?id={}", base_uri, openid).as_str()).await
}

#[wasm_bindgen]
pub async fn bind_booking(
    base_uri: &str,
    start: u32,
    openid: String,
    class_type: i8,
    page: &Page,
) -> Result<(), JsValue> {
    let json = get_json(
        format!(
            "{}/yoga/lessons?start={}&class_type={}&openid={}",
            base_uri, start, class_type, openid
        )
        .as_str(),
    )
    .await?;
    if json.is_array() {
        let data = js_sys::Object::new();
        // https://github.com/rustwasm/wasm-bindgen/blob/main/crates/js-sys/tests/wasm/Reflect.rs
        let values = sort_lessons(&json);
        let array = js_sys::Array::new();
        for index in 0..values.len() {
            let item = &values[index];
            let date_time = safe_f64(item, "date_time");
            let start_time = safe_f64(item, "start_time");
            let end_time = safe_f64(item, "end_time");

            let now = now_in_seconds();
            if (now - date_time - start_time > 3600f64) {
                // 1
                Reflect::set(item, &"mode".into(), &JsValue::from(1)).unwrap();
                Reflect::set(item, &"label".into(), &"已完成".into()).unwrap();
            } else if (now - date_time - start_time > 0f64) {
                // 10000

                Reflect::set(item, &"mode".into(), &JsValue::from(16)).unwrap();
                Reflect::set(item, &"label".into(), &"正在上课".into()).unwrap();
            } else if (date_time + start_time - now < 3600f64) {
                // 1000
                Reflect::set(item, &"mode".into(), &JsValue::from(8)).unwrap();
                Reflect::set(item, &"label".into(), &"准备上课".into()).unwrap();
            } else {
                let hidden = safe_f64(item, "hidden") as i8;
                let peoples = safe_f64(item, "peoples") as u8;
                let count = safe_f64(item, "count") as u8;
                if hidden == -1 {
                    // 100
                    Reflect::set(item, &"mode".into(), &JsValue::from(4)).unwrap();
                    Reflect::set(item, &"label".into(), &"已取消".into()).unwrap();
                } else if count >= peoples {
                    // 10
                    Reflect::set(item, &"mode".into(), &JsValue::from(2)).unwrap();
                    Reflect::set(item, &"label".into(), &"已满额".into()).unwrap();
                } else {
                    let reservation_id = safe_f64(item, "reservation_id");
                    if reservation_id == 0f64 {
                        // 100000
                        Reflect::set(item, &"mode".into(), &JsValue::from(32)).unwrap();
                        Reflect::set(item, &"label".into(), &"预约".into()).unwrap();
                    } else {
                        // 1000000
                        Reflect::set(item, &"mode".into(), &JsValue::from(64)).unwrap();
                        Reflect::set(item, &"label".into(), &"取消预约".into()).unwrap();
                    }
                }
            }
            add_lesson_time(item, start_time, end_time);
            array.push(item);
        }

        Reflect::set(&data, &"lessons".into(), &array).unwrap();
        page.set_data(data);
    }
    Ok(())
}
fn add_lesson_time(item: &JsValue, start_time: f64, end_time: f64) {
    let _ = Reflect::set(
        item,
        &"time".into(),
        &format!(
            "{}-{}",
            format_seconds(start_time),
            format_seconds(end_time)
        )
        .into(),
    );
}
fn format_seconds(seconds: f64) -> String {
    format!(
        "{}:{:02}",
        (seconds / 3600f64).floor(),
        seconds % 3600f64 / 60f64
    )
}
fn now_in_seconds() -> f64 {
    (Date::now() / 1000f64).floor()
}
fn safe_f64(obj: &JsValue, key: &str) -> f64 {
    match Reflect::get(obj, &key.into()) {
        Ok(v) => v.as_f64().unwrap_or(0f64),
        Err(_) => 0f64,
    }
}
fn sort_lessons(json: &JsValue) -> Vec<JsValue> {
    let mut values = js_sys::Array::from(json).iter().collect::<Vec<JsValue>>();
    values.sort_by(|a, b| {
        safe_f64(&a, "start_time")
            .partial_cmp(&safe_f64(&b, "start_time"))
            .unwrap()
    });
    values
}
