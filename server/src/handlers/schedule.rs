use crate::utils::data::query_json_with_params;
use deadpool_postgres::Pool;
use image::io::Reader as ImageReader;
use image::{Rgba, RgbImage};
use imageproc::drawing::{draw_text_mut, text_size};
use imageproc::rect::Rect;
use rocket::http::Status;
use rocket::State;
use std::io::{Cursor, Write};
use std::path::Path;
use rusttype::{Font, Scale};

#[get("/yoga/admin/schedule")]
pub async fn admin_schedule(pool: &State<Pool>) -> Result<Vec<u8>, Status> {
    let bytes =include_bytes!("pattern.png") as &[u8];
    let mut image = ImageReader::new(Cursor::new(bytes))
        .with_guessed_format()
        .unwrap()
        .decode()
        .unwrap();
 let font = Vec::from(include_bytes!("PingFang.ttf") as &[u8]);
    let font = Font::try_from_vec(font).unwrap();

    let height = 16f32;
    let scale = Scale {
        x: height * 1.0,
        y: height,
    };

    let text = "Hello, world!";
    draw_text_mut(&mut image, Rgba([0u8, 0u8, 255u8, 255u8]), (185f32*1.5f32) as i32, 123+335, scale, &font, text);
    let mut bytes: Vec<u8> = Vec::new();
   let  _= image.write_to(&mut Cursor::new(&mut bytes), image::ImageOutputFormat::Png);
    Ok(bytes)
}
