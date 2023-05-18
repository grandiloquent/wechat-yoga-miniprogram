use js_sys::{Array, Date, Object, Reflect};
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
#[wasm_bindgen]
pub async fn delete_booked(base_uri: &str, id: u32, openid: String) -> Result<JsValue, JsValue> {
    get_json(
        format!(
            "{}/yoga/admin/lesson/delete?id={}&openid={}",
            base_uri, id, openid
        )
        .as_str(),
    )
    .await
}
#[wasm_bindgen]
pub async fn lessons_and_teachers(page: &Page, base_uri: &str, id: u32, openid: String) {
    let json = get_json(
        format!(
            "{}/yoga/admin/lessons/and/teachers?&id={}&openid={}",
            base_uri, id, openid
        )
        .as_str(),
    )
    .await
    .unwrap();
    let obj = Object::from(json);
    let start_times = Array::new();
    start_times.push(&JsValue::from_str("9:00"));
    start_times.push(&JsValue::from_str("19:30"));
    let _ = Reflect::set(
        &obj,
        &JsValue::from_str("start_times"),
        &JsValue::from(start_times),
    );
    let peoples = Array::new();
    peoples.push(&JsValue::from_str("8"));
    peoples.push(&JsValue::from_str("16"));
    let _ = Reflect::set(&obj, &JsValue::from_str("peoples"), &JsValue::from(peoples));

    let class_types = Array::new();
    class_types.push(&JsValue::from_str("团课"));
    class_types.push(&JsValue::from_str("小班"));
    class_types.push(&JsValue::from_str("私教"));
    let _ = Reflect::set(
        &obj,
        &JsValue::from_str("class_types"),
        &JsValue::from(class_types),
    );

    page.set_data(obj);
}
#[wasm_bindgen]
pub async fn lesson_update(
    base_uri: &str,
    openid: String,
    data: String,
) -> Result<JsValue, JsValue> {
    post_data(
        format!("{}/yoga/lesson/update?openid={}", base_uri, openid).as_str(),
        data.as_str(),
    )
    .await
}

#[wasm_bindgen]
pub async fn query_lessons(page: &Page, base_uri: &str, start: u32, end: u32, openid: String) {
    let json = get_json(
        format!(
            "{}/yoga/admin/lessons?start={}&end={}&openid={}",
            base_uri, start, end, openid
        )
        .as_str(),
    )
    .await
    .unwrap();
    let array = Array::from(&json);
    for index in 0..array.length() {
        let json = array.get(index);
        let peoples = Reflect::get(&json, &"peoples".into())
            .unwrap()
            .as_f64()
            .unwrap();
        let count = Reflect::get(&json, &"count".into())
            .unwrap()
            .as_f64()
            .unwrap();
        let dif = peoples - count;
        if dif == 0f64 {
            let _ = Reflect::set(&json, &JsValue::from_str("dif"), &"已满额".into());
        } else {
            let _ = Reflect::set(
                &json,
                &JsValue::from_str("dif"),
                &format!("差 {} 人", dif).into(),
            );
        }

        let date_time = Reflect::get(&json, &"date_time".into())
            .unwrap()
            .as_f64()
            .unwrap();
        let now = Date::new(&JsValue::from(date_time * 1000f64));

        let start_time = Reflect::get(&json, &"start_time".into())
            .unwrap()
            .as_f64()
            .unwrap();
        let time = if start_time < 43200f64 {
            "上午"
        } else {
            "晚上"
        };
        let _ = Reflect::set(
            &json,
            &JsValue::from_str("date"),
            &format!("{}月{}日{}", now.get_month() + 1, now.get_date(), time).into(),
        );
        let _ = Reflect::set(
            &json,
            &JsValue::from_str("expired"),
            &JsValue::from_bool(check_if_lesson_expired(date_time, start_time)),
        );
    }
    let mut items = array.iter().collect::<Vec<JsValue>>();
    items.sort_by(|x, y| {
        let x1 = Reflect::get(&x, &"date_time".into())
            .unwrap()
            .as_f64()
            .unwrap();
        let y1 = Reflect::get(&y, &"date_time".into())
            .unwrap()
            .as_f64()
            .unwrap();
        if x1 == y1 {
            let x2 = Reflect::get(&x, &"start_time".into())
                .unwrap()
                .as_f64()
                .unwrap();
            let y2 = Reflect::get(&y, &"start_time".into())
                .unwrap()
                .as_f64()
                .unwrap();
            return x2.partial_cmp(&y2).unwrap();
        } else {
            return x1.partial_cmp(&y1).unwrap();
        }
    });
    let array = js_sys::Array::new();
    for index in 0..items.len() {
        array.push(&items[index]);
    }
    let obj = Object::new();
    let _ = Reflect::set(&obj, &JsValue::from_str("lessons"), &array);
    page.set_data(obj);
}

fn check_if_lesson_expired(date_time: f64, start_time: f64) -> bool {
    // log(format!(
    //     "check_if_lesson_expired: date_time = {}\n start_time= {}",
    //     date_time, start_time
    // )
    // .as_str());
    let now = Date::new_0();
    let senconds = now.get_hours() * 3600 + now.get_minutes() * 60;

    let now = Date::new_with_year_month_day_hr_min_sec_milli(
        now.get_full_year(),
        (now.get_month()) as i32,
        now.get_date() as i32,
        0,
        0,
        0,
        0,
    );
    // log(format!("check_if_lesson_expired: now = {}", now.get_time()).as_str());
    let now = now.get_time() / 1000f64;
    // log(format!(
    //     "check_if_lesson_expired: now = {}\n senconds = {}",
    //     now, senconds
    // )
    // .as_str());

    if date_time - now >= 86400f64 {
        return false;
    }

    if (date_time - now >= 0f64 && date_time - now < 86400f64) && start_time > senconds as f64 {
        return false;
    }
    return true;
}

#[wasm_bindgen]
pub async fn user_lessons(
    page: &Page,
    base_uri: &str,
    id: i32,
    start: i32,
    end: i32,
    open_id: String,
) {
    let json = get_json(
        format!(
            "{}/yoga/admin/user/lessons?id={}&start={}&end={}&open_id={}",
            base_uri, id, start, end, open_id
        )
        .as_str(),
    )
    .await
    .unwrap();
    let obj = Object::from(json);
    page.set_data(obj);
}

#[wasm_bindgen]
pub async fn users_all(page: &Page, base_uri: &str, open_id: String) {
    let json = get_json(format!("{}/yoga/admin/users/all?open_id={}", base_uri, open_id).as_str())
        .await
        .unwrap();
    let obj = Object::new();
    let array = Array::from(&json);
    // creation_time
    let mut array = array.iter().collect::<Vec<_>>();
    array.sort_by(|x, y| {
        let x1 = Reflect::get(x, &"creation_time".into())
            .unwrap()
            .as_f64()
            .unwrap();
        let y1 = Reflect::get(y, &"creation_time".into())
            .unwrap()
            .as_f64()
            .unwrap();
        return y1.partial_cmp(&x1).unwrap();
    });
    let now = Date::now() / 1000f64;
    let _ = Reflect::set(
        &obj,
        &"students".into(),
        &array
            .iter()
            .map(|x| {
                let x1 = Reflect::get(x, &"creation_time".into())
                    .unwrap()
                    .as_f64()
                    .unwrap();
                let _ = Reflect::set(&x, &"timeago".into(), &timeago(now - x1).as_str().into());
                x
            })
            .collect::<Array>(),
    );
    let _ = Reflect::set(&obj, &"loaded".into(), &JsValue::from_bool(true));
    page.set_data(obj);
}

fn timeago(seconds: f64) -> String {
    if seconds > 31536036f64 {
        return format!("{}年之前", (seconds / 31536036f64) as u64);
    } else if seconds > 2628003f64 {
        return format!("{}月之前", (seconds / 2628003f64) as u64);
    } else if seconds > 604800f64 {
        return format!("{}周之前", (seconds / 604800f64) as u64);
    } else if seconds > 86400f64 {
        return format!("{}天之前", (seconds / 86400f64) as u64);
    } else if seconds > 3600f64 {
        return format!("{}小时之前", (seconds / 3600f64) as u64);
    } else if seconds > 60f64 {
        return format!("{}分钟之前", (seconds / 60f64) as u64);
    } else if seconds > 0f64 {
        return format!("{}秒之前", seconds);
    }

    return "刚刚".to_string();
}
#[wasm_bindgen]
pub async fn user(page: &Page, base_uri: &str, open_id: String, id: i32) {
    let json =
        get_json(format!("{}/yoga/admin/user?open_id={}&id={}", base_uri, open_id, id).as_str())
            .await
            .unwrap();
    let obj = Object::from(json);
    let date = Date::new(&JsValue::from_f64(
        Reflect::get(&obj, &"creation_time".into())
            .unwrap()
            .as_f64()
            .unwrap()
            * 1000f64,
    ));
    let _ = Reflect::set(
        &obj,
        &"date".into(),
        &format!(
            "{}年{}月{}日 {}时{}分{}秒",
            date.get_full_year(),
            date.get_month() + 1,
            date.get_date(),
            date.get_hours(),
            date.get_minutes(),
            date.get_seconds()
        )
        .into(),
    );

    let _ = Reflect::set(&obj, &"loaded".into(), &JsValue::from_bool(true));

    page.set_data(obj);
}
#[wasm_bindgen]
pub async fn lessons_update(
    base_uri: &str,
    open_id: String,
    obj: String,
) -> Result<JsValue, JsValue> {
    let json = post_data(
        format!("{}/yoga/admin/lessons/update?open_id={}", base_uri, open_id,).as_str(),
        obj.as_str(),
    )
    .await?;
    Ok(json)
}
