use crate::utils::data::query_json_with_params;
use deadpool_postgres::Pool;
use rocket::http::Status;
use rocket::State;
#[get("/yoga/user/query?<openid>")]
pub async fn user_query(openid: String, pool: &State<Pool>) -> Result<String, Status> {
    match pool.get().await {
        Ok(conn) => {
            match query_json_with_params(&conn, "select * from fn_user_query($1)", &[&openid])
                .await
            {
                Ok(v) => {
                    return match String::from_utf8(v.0) {
                        Ok(v) => Ok(v),
                        Err(_) => Err(Status::InternalServerError),
                    };
                }
                Err(error) => {
                    println!("Error: {}", error);
                    Err(Status::NoContent)
                }
            }
        }
        Err(error) => {
            println!("Error: {}", error);
            Err(Status::InternalServerError)
        }
    }
}