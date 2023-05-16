use crate::utils::data::{query_json_with_params, Body};
use deadpool_postgres::Pool;
use rocket::http::Status;
use rocket::State;
#[get("/yoga/user/query?<openid>")]
pub async fn user_query(openid: String, pool: &State<Pool>) -> Result<String, Status> {
    match pool.get().await {
        Ok(conn) => {
            match query_json_with_params(&conn, "select * from fn_user_query($1)", &[&openid]).await
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
#[post("/yoga/user", data = "<data>")]
pub async fn register_user(data: String, pool: &State<Pool>) -> Result<String, Status> {
    match pool.get().await {
        Ok(conn) => {
            match query_json_with_params(&conn, "select * from fn_user_update($1)", &[&Body(data)])
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
                    Err(Status::InternalServerError)
                }
            }
        }
        Err(error) => {
            println!("Error: {}", error);
            Err(Status::InternalServerError)
        }
    }
}
#[get("/yoga/user/book/statistics?<id>")]
pub async fn user_book_statistics(id:String, pool: &State<Pool>) -> Result<String, Status> {
    match pool.get().await {
        Ok(conn) => {
            match query_json_with_params(&conn, "select * from fn_user_book_statistics($1)", &[&id.as_str()])
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
                    Err(Status::InternalServerError)
                }
            }
        }
        Err(error) => {
            println!("Error: {}", error);
            Err(Status::InternalServerError)
        }
    }
}