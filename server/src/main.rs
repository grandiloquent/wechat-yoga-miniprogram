use rocket::{figment::Figment, log::LogLevel};

#[macro_use]
extern crate rocket;

#[rocket::main]
async fn main() -> Result<(), rocket::Error> {
    // let limits = Limits::default()
    //     .limit("json", 3.mebibytes())
    //     .limit("string", 3.mebibytes())
    //     .limit("file", 5.gibibytes());

    let figment = Figment::from(rocket::Config::default())
        .merge((rocket::Config::ADDRESS, "127.0.0.1"))
        .merge((rocket::Config::PORT, 8002))
        //.merge((rocket::Config::TEMP_DIR, ""))
        //.merge((rocket::Config::LIMITS, limits))
        .merge((rocket::Config::LOG_LEVEL, LogLevel::Critical));

    rocket::custom(figment)
        .mount(
            "/",
            routes![
                
            ],
        )
        //.register("/", catchers![handlers::not_found::not_found])
        .launch()
        .await?;

    Ok(())
}


