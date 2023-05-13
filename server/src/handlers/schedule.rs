use crate::utils::data::query_json;
use deadpool_postgres::Pool;
use image::io::Reader as ImageReader;
use image::{DynamicImage, RgbImage, Rgba};
use imageproc::drawing::{draw_text_mut, text_size};
// use imageproc::rect::Rect;
use rocket::http::Status;
use rocket::State;
use rusttype::{point, Font, Rect, Scale};
use std::io::{Cursor, Write};
use std::path::Path;
#[get("/yoga/admin/schedule")]
// Vec<u8>
pub async fn admin_schedule(pool: &State<Pool>) -> Result<String, Status> {
     match pool.get().await {
        Ok(conn) => match query_json(&conn, "select * from fn_query_week_lessons()").await {
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
        },
        Err(error) => {
            println!("Error: {}", error);
            Err(Status::InternalServerError)
        }
    }
    /*let bytes = include_bytes!("pattern.png") as &[u8];
    let mut image = ImageReader::new(Cursor::new(bytes))
        .with_guessed_format()
        .unwrap()
        .decode()
        .unwrap();
    // https://docs.rs/rusttype/0.9.2/rusttype/enum.Font.html
    let font = Vec::from(include_bytes!("PingFang.ttf") as &[u8]);
    let font = Font::try_from_vec(font).unwrap();

    
    let text = "周一";
    draw_text(&font, &mut image, text,36.4,0,186);
    let mut bytes: Vec<u8> = Vec::new();
    let _ = image.write_to(&mut Cursor::new(&mut bytes), image::ImageOutputFormat::Png);
    Ok(bytes)
*/
}

// http://127.0.0.1:8002/yoga/admin/schedule
// 28f32,0, 446,
// 22.4,0,478
fn draw_text(font: &Font, image: &mut DynamicImage, text: &str, font_size:f32,x: i32, y: i32) {
   
    let scale = Scale {
        x: font_size,
        y: font_size,
    };
    // https://docs.rs/rusttype/latest/rusttype/struct.VMetrics.html
    let point = point(0.0, font.v_metrics(scale).ascent);
    let glyphs: Vec<Rect<i32>> = font
        .layout(text, scale, point)
        .map(|g| g.pixel_bounding_box().unwrap())
        .collect();
    let first = glyphs.first().unwrap().min;
    let last = glyphs.last().unwrap().max;
    let min_y = glyphs.iter().map(|g| g.min.y).min().unwrap();
    let max_y = glyphs.iter().map(|g| g.max.y).max().unwrap();
    let height = max_y - min_y;
    let width = last.x - first.x;

    // https://docs.rs/imageproc/latest/imageproc/drawing/fn.draw_text_mut.html
    // https://github.com/search?q=draw_text_mut%20path%3A*.rs&type=code
    draw_text_mut(
        image,
        Rgba([255u8, 255u8, 255u8, 255u8]),
        202i32 + 135 * x + (100 - width) / 2,
        y, 
        scale,
        &font,
        text,
    );
}

