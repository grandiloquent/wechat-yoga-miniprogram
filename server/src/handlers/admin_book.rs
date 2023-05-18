use crate::utils::data::{query_int_with_params, query_json_with_params, Body};
use deadpool_postgres::Pool;
use rocket::http::Status;
use rocket::State;

#[post("/yoga/admin/lessons/update?<open_id>", data = "<obj>")]
pub async fn admin_lessons_update(
    obj: String,
    open_id: String,
    pool: &State<Pool>,
) -> Result<String, Status> {
    match pool.get().await {
        Ok(conn) => {
            match query_int_with_params(
                &conn,
                "select * from fn_admin_lessons_update($1)",
                &[&Body(obj)],
            )
            .await
            {
                Ok(v) => {
                    return Ok(v.to_string());
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
