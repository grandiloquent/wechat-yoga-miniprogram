use crate::utils::data::{query_int_with_params, query_json_with_params, Body};

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
#[get("/yoga/admin/lesson/delete?<id>")]
pub async fn admin_lesson_delete(id: i32, pool: &State<Pool>) -> Result<String, Status> {
    match pool.get().await {
        Ok(conn) => {
            match query_int_with_params(&conn, "select * from fn_admin_lesson_delete($1)", &[&id])
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
#[get("/yoga/admin/lessons/and/teachers?<id>")]
pub async fn admin_lessons_and_teachers(id: i32, pool: &State<Pool>) -> Result<String, Status> {
    match pool.get().await {
        Ok(conn) => {
            match query_json_with_params(
                &conn,
                "select * from fn_admin_lessons_and_teachers($1)",
                &[&id],
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
#[post("/yoga/lesson/update", data = "<data>")]
pub async fn admin_lesson_update(data: String, pool: &State<Pool>) -> Result<String, Status> {
    match pool.get().await {
        Ok(conn) => match query_int_with_params(
            &conn,
            "select * from fn_admin_lesson_update($1)",
            &[&Body(data)],
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
        },
        Err(error) => {
            println!("Error: {}", error);
            Err(Status::InternalServerError)
        }
    }
}
