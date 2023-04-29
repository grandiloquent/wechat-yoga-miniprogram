use crate::utils::data::query_json;
use deadpool_postgres::Pool;
use rocket::http::Status;
use rocket::State;

#[get("/debug")]
pub async fn debug(pool: &State<Pool>) -> Result<String, Status> {
    match pool.get().await {
        Ok(conn) => match query_json(&conn, "select * from fn_debug()").await {
            Ok(v) => {
                return match String::from_utf8(v.0) {
                    Ok(v) => Ok(v),
                    Err(_) => Err(Status::InternalServerError),
                };
            }
            Err(error) => {
                println!("Error: {}", error);
                Err(Status::InternalServerError)
            }
        },
        Err(error) => {
            println!("Error: {}", error);
            Err(Status::InternalServerError)
        }
    }
}
