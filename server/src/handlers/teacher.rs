use crate::utils::data::{query_int_with_params, query_json_with_params, Body};
use deadpool_postgres::Pool;
use rocket::http::Status;
use rocket::State;
#[get("/yoga/teacher/lessons?<start_time>&<end_time>&<open_id>&<class_type>&<teacher_id>")]
pub async fn teacher_lessons(
    start_time: i32,
    end_time: i32,
    open_id: String,
    class_type: i32,
    teacher_id: i32,
    pool: &State<Pool>,
) -> Result<String, Status> {
    match pool.get().await {
        Ok(conn) => {
            match query_json_with_params(
                &conn,
                "select * from fn_teacher_lessons($1,$2,$3,$4,$5)",
                &[&start_time,&end_time,&open_id,&class_type,&teacher_id],
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
