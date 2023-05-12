use crate::utils::data::query_json_with_params;
use crate::utils::data::query_int_with_params;
use deadpool_postgres::Pool;
use rocket::http::Status;
use rocket::State;
#[get("/yoga/admin/lessons?<start>&<end>")]
pub async fn admin_lessons(start: i32, end: i32, pool: &State<Pool>) -> Result<String, Status> {
    match pool.get().await {
        Ok(conn) => {
            match query_json_with_params(
                &conn,
                "select * from fn_admin_lessons($1,$2,5)",
                &[&start, &end],
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
#[get("/yoga/admin/lesson?<id>")]
pub async fn admin_lesson(id: i32, pool: &State<Pool>) -> Result<String, Status> {
    match pool.get().await {
        Ok(conn) => {
            match query_json_with_params(&conn, "select * from fn_admin_lesson($1)", &[&id]).await {
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
#[get("/yoga/admin/lesson/hidden?<id>&<status>")]
pub async fn admin_lesson_hidden(
    id: i32,
    status: i32,
    pool: &State<Pool>,
) -> Result<String, Status> {
    match pool.get().await {
        Ok(conn) => {
            match query_int_with_params(
                &conn,
                "select * from fn_admin_lesson_update_status($1,$2)",
                &[&id, &status],
            )
            .await
            {
                Ok(v) => Ok(v.to_string()),
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