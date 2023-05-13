use rocket::fairing::{Fairing, Info, Kind};
use rocket::http::Header;
use rocket::{Request, Response};

use super::string::StringExt;

pub struct ContentDisposition;

#[rocket::async_trait]
impl Fairing for ContentDisposition {
    fn info(&self) -> Info {
        Info {
            name: "Attaching ContentDisposition headers to responses",
            kind: Kind::Response,
        }
    }

    async fn on_response<'r>(&self, request: &'r Request<'_>, response: &mut Response<'r>) {
        // https://api.rocket.rs/v0.4/rocket/struct.Request.html#method.uri
        let p = request.uri().path();
        if p=="/yoga/admin/schedule" {
            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition
            response.set_header(Header::new(
                "Content-Disposition",
                format!(
                    "attachment; filename=\"{}\"",
                    "1.png"
                ),
            ));
        }
    }
}
