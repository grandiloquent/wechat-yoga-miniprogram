use chinese_lunisolar_calendar::chrono::prelude::*;
use chinese_lunisolar_calendar::{ChineseVariant, LunisolarDate};
use js_sys::{Date, Object, Reflect};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    pub fn log(s: &str);
    #[wasm_bindgen(catch, js_name = "getJson",js_namespace = shared)]
    pub async fn get_json(s: &str) -> Result<JsValue, JsValue>;
}
#[wasm_bindgen]
pub async fn beijing_time() -> Result<JsValue, JsValue> {
    let json =
        get_json("https://api.m.taobao.com/rest/api3.do?api=mtop.common.getTimestamp").await?;
    if json.is_object() {
        //let obj = json.dyn_into::<Object>().unwrap();
        let data = Reflect::get(json.as_ref(), &"data".into())?;
        let t = Reflect::get(data.as_ref(), &"t".into())?;
        // let now = Date::new(&JsValue::from_f64(
        //     t.as_string()
        //         .unwrap_or(String::from("0"))
        //         .parse::<f64>()
        //         .unwrap(),
        // ));
        // return Ok(format!(
        //     "北京时间 {}时{}分{}秒",
        //     now.get_hours(),
        //     now.get_minutes(),
        //     now.get_seconds()
        // ));
        return Ok(t);
    }
    Err("")?
}
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
#[wasm_bindgen]
pub async fn get_weather() -> Result<String, JsValue> {
    let json =
        get_json("https://wis.qq.com/weather/common?source=xw&refer=h5&weather_type=observe&province=%E6%B9%96%E5%8D%97%E7%9C%81&city=%E9%95%BF%E6%B2%99%E5%B8%82").await?;
    if json.is_object() {
        //let obj = json.dyn_into::<Object>().unwrap();
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
        // let now = Date::new(&JsValue::from_f64(
        //     t.as_string()
        //         .unwrap_or(String::from("0"))
        //         .parse::<f64>()
        //         .unwrap(),
        // ));
        return Ok(format!(
            "长沙市 {}{}° {}{}级",
            weather.as_string().unwrap(),
            degree.as_string().unwrap(),
            wind_direction,
            wind_power.as_string().unwrap(),
        ));
    }
    Err("")?
}
/*

Set-Location C:\Users\Administrator\WeChatProjects\yg\WebAssembly\weixin;wasm-pack build --target web --out-dir C:\Users\Administrator\WeChatProjects\yg\utils

 */
