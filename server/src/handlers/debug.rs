use crate::utils::client_real_addr::ClientRealAddr;
use crate::utils::data::query_json;
use deadpool_postgres::Pool;
use rocket::http::Status;
use rocket::State;
#[post("/yoga/debug", data = "<data>")]
pub fn debug(
    client_addr: &ClientRealAddr,
    data: String,
    pool: &State<Pool>,
) -> Result<String, Status> {
    // match pool.get().await {
    //     Ok(conn) => match query_json(&conn, "select * from fn_debug()").await {
    //         Ok(v) => {
    //             return match String::from_utf8(v.0) {
    //                 Ok(v) => Ok(v),
    //                 Err(_) => Err(Status::InternalServerError),
    //             };
    //         }
    //         Err(error) => {
    //             println!("Error: {}", error);
    //             Err(Status::InternalServerError)
    //         }
    //     },
    //     Err(error) => {
    //         println!("Error: {}", error);
    //         Err(Status::InternalServerError)
    //     }
    // }
    //println!("{} {}", client_addr.get_ipv4_string().unwrap(),data);
    Ok(String::new())
}