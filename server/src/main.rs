mod errors;
mod handlers;
mod utils;

use std::env;

use deadpool_postgres::{ManagerConfig, Runtime};
use tokio_postgres::NoTls;

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
    // 实例化和启动 rocket
    rocket::build()
        .manage(
            config
                .create_pool(Some(Runtime::Tokio1), NoTls)
                .expect("Can't create pool"),
        )
        .mount("/", routes![handlers::auth::auth,handlers::booking::lessons,handlers::debug::debug,handlers::index::index])
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
