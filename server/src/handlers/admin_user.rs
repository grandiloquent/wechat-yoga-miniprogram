use crate::utils::data::query_json_with_params;
use deadpool_postgres::Pool;
use rocket::http::Status;
use rocket::State;
#[get("/yoga/admin/user/lessons?<id>&<start>&<end>&<open_id>")]
pub async fn admin_user_lessons(
    id: i32,
    start: i64,
    end: i64,
    open_id: String,
    pool: &State<Pool>,
) -> Result<String, Status> {
    match pool.get().await {
        Ok(conn) => {
            match query_json_with_params(
                &conn,
                "select * from fn_admin_user_lessons($1,$2,$3)",
                &[&id, &start, &end],
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
#[get("/yoga/admin/users/all?<open_id>")]
pub async fn admin_users_all(open_id: String, pool: &State<Pool>) -> Result<String, Status> {
    match pool.get().await {
        Ok(conn) => {
            match query_json_with_params(&conn, "select * from fn_admin_users_all()", &[]).await {
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