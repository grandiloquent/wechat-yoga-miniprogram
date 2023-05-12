use crate::utils::data::query_json_with_params;
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