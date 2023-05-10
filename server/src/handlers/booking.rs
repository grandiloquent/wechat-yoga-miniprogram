use crate::utils::data::query_json_with_params;
use deadpool_postgres::Pool;
use rocket::http::Status;
use rocket::State;
#[get("/yoga/lessons?<start>&<openid>&<class_type>")]
pub async fn lessons(
    start: i32,
    openid: String,
    class_type: i32,
    pool: &State<Pool>,
) -> Result<String, Status> {
    match pool.get().await {
        Ok(conn) => match query_json_with_params(
            &conn,
            "select * from fn_lessons_next_two_weeks($1,$2,$3)",
            &[&start, &openid, &class_type],
        )
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
        },
        Err(error) => {
            println!("Error: {}", error);
            Err(Status::InternalServerError)
        }
    }
}
#[get("/yoga/book?<id>&<openid>")]
pub async fn book(id: i32, openid: String, pool: &State<Pool>) -> Result<String, Status> {
    match pool.get().await {
        Ok(conn) => {
            match query_json_with_params(&conn, "select * from fn_book($1,$2)", &[&id, &openid])
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