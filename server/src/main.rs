mod errors;
mod handlers;
mod models;
mod utils;

use std::env;

use deadpool_postgres::{ManagerConfig, Runtime};
use models::settings::Settings;
use rocket::data::{Limits, ToByteUnit};
use rocket::figment::Figment;
use tokio_postgres::NoTls;
use crate::utils::content_disposition::ContentDisposition;

#[macro_use]
extern crate rocket;

#[rocket::main]
async fn main() -> Result<(), rocket::Error> {
    // 配置 PostgreSQL 数据库
    // 通过环境变量设置数据库公网IP，端口，数据库名称，用户名，密码
    let mut config = deadpool_postgres::Config::new();

    config.host = Some(env::var("DB_HOST").expect("Please specify DB_HOST"));
    config.port = Some(
        env::var("DB_PORT")
            .expect("Please specify DB_PORT")
            .parse::<u16>()
            .expect("Couldn't parse"),
    );
    config.password = Some(env::var("DB_PASSWORD").expect("Please specify DB_PASSWORD"));
    config.dbname = Some("yoga".to_string());
    config.user = Some("psycho".to_string());
    config.manager = Some(ManagerConfig {
        recycling_method: deadpool_postgres::RecyclingMethod::Fast,
    });
    let limits = Limits::default().limit("limits.file", 10.megabytes());

    let figment = Figment::from(rocket::Config::default())
        .merge((rocket::Config::ADDRESS, "127.0.0.1"))
        .merge((rocket::Config::PORT, 8002))
        .merge((rocket::Config::LIMITS, limits));
    // 实例化和启动 rocket
    rocket::build()
        .configure(figment)
        .attach(ContentDisposition)
        .manage(Settings {
            appid: env::var("APPID").expect("Couldn't find appid"),
            secret: env::var("SECRET").expect("Couldn't find secret"),
            image_dir: env::var("IMAGE_DIR").expect("Couldn't find image_dir"),
        })
        .manage(
            config
                .create_pool(Some(Runtime::Tokio1), NoTls)
                .expect("Can't create pool"),
        )
        .mount(
            "/",
            routes![handlers::admin_lessons::admin_lessons,
handlers::admin_lessons::admin_lesson,
handlers::admin_lessons::admin_lesson_hidden,
handlers::admin_lessons::admin_lesson_delete,
handlers::admin_lessons::admin_lessons_and_teachers,
handlers::admin_lessons::admin_lesson_update,
handlers::admin_user::admin_user_lessons,
handlers::admin_user::admin_users_all,
handlers::admin_user::admin_user,
handlers::auth::auth,
handlers::booking::lessons,
handlers::booking::book,
handlers::booking::unbook,
handlers::debug::debug,
handlers::favicon::favicon,
handlers::index::index,
handlers::picture::picture,
handlers::picture::avatar,
handlers::schedule::admin_schedule,
handlers::teacher::teacher_lessons,
handlers::user::user_query,
handlers::user::register_user,
handlers::user::user_book_statistics],
        )
        .register(
            "/",
            catchers![
                errors::not_found::not_found,
                errors::internal_error::internal_error
            ],
        )
        .launch()
        .await?;
    Ok(())
}
