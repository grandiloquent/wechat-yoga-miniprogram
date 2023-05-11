use rocket::http::Status;
#[get("/favicon.ico")]
pub fn favicon() -> Result<String, Status> {
    Err(Status::NotFound)
}