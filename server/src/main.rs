mod errors;
mod handlers;

use std::env;

use deadpool_postgres::{ManagerConfig, Runtime};
use tokio_postgres::NoTls;

#[macro_use]
extern crate rocket;

#[rocket::main]
async fn main() -> Result<(), rocket::Error> {
    let mut config = deadpool_postgres::Config::new();

    config.host = Some(env::var("DB_HOST").expect("Can't specify"));
    config.port = Some(
        env::var("DB_PORT")
            .expect("Can't specify")
            .parse::<u16>()
            .expect("Couldn't parse"),
    );
    config.password = Some(env::var("DB_PASSWORD").expect("Can't specify"));
    config.dbname = Some("yoga".to_string());
    config.user = Some("psycho".to_string());
    config.manager = Some(ManagerConfig {
        recycling_method: deadpool_postgres::RecyclingMethod::Fast,
    });

    rocket::build()
        .manage(
            config
                .create_pool(Some(Runtime::Tokio1), NoTls)
                .expect("Can't create pool"),
        )
        .mount("/", routes![])
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
