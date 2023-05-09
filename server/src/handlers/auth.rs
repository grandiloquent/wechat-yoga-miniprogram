use std::{collections::HashMap, error::Error};

use rocket::{http::Status, State};

use crate::models::settings::Settings;

async fn login_we_chat(
    settings: &State<Settings>,
    js_code: String,
) -> Result<String, Box<dyn Error>> {
    // println!(
    //     "login_we_chat: {}\n{}\n{}",
    //     settings.appid, settings.secret, js_code
    // );
    let mut params = HashMap::new();
    params.insert("appid", settings.appid.clone());
    params.insert("secret", settings.secret.clone());
    params.insert("js_code", js_code);
    params.insert("grant_type", "authorization_code".to_string());
    let client = reqwest::Client::new();
    let res = client
        .post("https://api.weixin.qq.com/sns/jscode2session")
        .form(&params)
        .send()
        .await?;
    let json = res.text().await?;
    Ok(json)
}

#[get("/auth?<code>")]
pub async fn auth(code: String, settings: &State<Settings>) -> Result<String, Status> {
    let json = login_we_chat(settings, code).await;
    match json {
        Ok(v) => Ok(v),
        Err(err) => {
            println!("auth: {}", err);
            Err(Status::InternalServerError)
        }
    }
}

/*
https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/user-login/code2Session.html

console.log([...$0.querySelectorAll('tr>td:first-child')].map(x=>`params.insert("${x.textContent}",${x.textContent});`).join('\n'))

https://github.com/seanmonstar/reqwest
 */
