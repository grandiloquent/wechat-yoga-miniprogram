use crate::models::settings::Settings;
use rocket::form::{Form, FromForm};
use rocket::fs::TempFile;
use rocket::State;
//use image::{GenericImage, GenericImageView, ImageBuffer, RgbImage};
use std::path::Path;
#[derive(FromForm)]
pub struct Upload<'f>(TempFile<'f>);
#[post("/yoga/picture", data = "<form>")]
pub async fn picture(
    mut form: Form<Upload<'_>>,
    settings: &State<Settings>,
) -> std::io::Result<()> {
    println!("{}", form.0.path().unwrap().to_str().unwrap());
    //let img = image::open(form.0.path().unwrap()).unwrap();
    //println!("{}x{} {}",img.width(),img.height(),form.0.path().unwrap().to_str().unwrap());
    //form.upload.persist_to("/tmp/complete/file.txt").await?;
    Ok(())
}
#[post("/yoga/avatar", data = "<form>")]
pub async fn avatar(
    mut form: Form<Upload<'_>>,
    settings: &State<Settings>,
) -> std::io::Result<String> {
    let name = form.0.name().unwrap().to_string()+".avif";
    let path = Path::new(settings.image_dir.as_str());
    form.0.persist_to(path.join(name.clone())).await?;
    Ok(name)
}