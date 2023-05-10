use crate::utils::client_real_addr::ClientRealAddr;
use crate::utils::data::{Body, query_int_with_params};
use deadpool_postgres::Pool;
use rocket::http::Status;
use rocket::State;

#[post("/yoga/debug", data = "<data>")]
pub async fn debug(
    client_addr: &ClientRealAddr,
    data: String,
    pool: &State<Pool>,
) -> Result<String, Status> {
    match pool.get().await {
        Ok(conn) => match query_int_with_params(&conn, "select * from fn_debug($1,$2)",
                                                &[
                                                    &Body(data),
                                                    &client_addr.ip.to_string().as_str()]).await {
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