#[macro_use]
extern crate rocket;

#[rocket::main]
async fn main() -> Result<(), rocket::Error> {
    // https://rocket.rs/v0.4/guide/configuration/#rockettoml
    rocket::build()
        .mount("/", routes![])
        //.register("/", catchers![handlers::not_found::not_found])
        .launch()
        .await?;

    Ok(())
}

