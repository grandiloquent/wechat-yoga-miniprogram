use chinese_lunisolar_calendar::chrono::prelude::*;
use chinese_lunisolar_calendar::{ChineseVariant, LunisolarDate};
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
    pub async fn post_data(url: &str,data:&str) -> Result<JsValue, JsValue>;
    
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


#[wasm_bindgen]
pub async fn get_open_id(base_uri:&str) -> Result<String, JsValue> {
    let code=get_login_code().await?;
    let json =
    post_data(format!("{}/auth",base_uri).as_str(),code.as_string().unwrap().as_str()).await?;
    Ok("".to_string())
}