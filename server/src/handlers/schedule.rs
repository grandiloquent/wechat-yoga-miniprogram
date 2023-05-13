use crate::utils::data::query_json;
use deadpool_postgres::Pool;
use image::io::Reader as ImageReader;
use image::{DynamicImage, RgbImage, Rgba};
use imageproc::drawing::{draw_text_mut, text_size};
// use imageproc::rect::Rect;
use rocket::http::Status;
use rocket::serde::json::serde_json;

use chrono::{Datelike, LocalResult, NaiveDateTime, TimeZone, Utc, Weekday};
use chrono_tz::Tz;
use rocket::serde::json::Value;
use rocket::State;
use rusttype::{point, Font, Rect, Scale};
use std::io::{Cursor, Write};
use std::path::Path;

#[get("/yoga/admin/schedule")]

pub async fn admin_schedule(pool: &State<Pool>) -> Result<Vec<u8>, Status> {
    let conn = match pool.get().await {
        Ok(conn) => conn,
        Err(error) => {
            println!("Error: {}", error);
            return Err(Status::InternalServerError);
        }
    };
    let obj: Value = match query_json(&conn, "select * from fn_query_week_lessons()").await {
        Ok(v) => serde_json::from_slice(&v.0).unwrap(),
        Err(error) => {
            println!("Error: {}", error);
            return Err(Status::InternalServerError);
        }
    };

    let bytes = include_bytes!("pattern.png") as &[u8];

    // https://docs.rs/rusttype/0.9.2/rusttype/enum.Font.html
    let font = Vec::from(include_bytes!("PingFang.ttf") as &[u8]);
    let font = Font::try_from_vec(font).unwrap();

    // https://docs.rs/serde_json/latest/serde_json/value/enum.Value.html#method.as_array
    let obj = obj.as_array().unwrap();

    let mut image = ImageReader::new(Cursor::new(bytes))
        .with_guessed_format()
        .unwrap()
        .decode()
        .unwrap();
    for index in 0..obj.len() {
        let lesson = obj.get(index).unwrap();
        println!("{:?}", lesson);
        let timestamp_i64 = lesson["date_time"].as_i64().unwrap();
        let start_time = lesson["start_time"].as_i64().unwrap();
        let tz: Tz = "Asia/Hong_Kong".parse().unwrap();
        // https://docs.diesel.rs/1.4.x/chrono/offset/trait.TimeZone.html#method.timestamp_millis_opt
        if let Some(dt) = NaiveDateTime::from_timestamp_opt(timestamp_i64, 0) {
            let utc_time = dt.and_local_timezone(Utc).unwrap();
            // https://docs.rs/chrono/latest/chrono/struct.DateTime.html#method.with_timezone
            let hkt = utc_time.with_timezone(&tz);
            let dt = hkt.date_naive();
            if start_time == 32400 {
                match dt.weekday() {
                    Weekday::Mon => {
                        draw_text(&font, &mut image, "周一", 36.4, 0, 186);
                        draw_text(
                            &font,
                            &mut image,
                            lesson["lesson_name"].as_str().unwrap(),
                            28f32,
                            0,
                            311,
                        );
                    }
                    Weekday::Tue => {
                        draw_text(&font, &mut image, "周二", 36.4, 1, 186);
                        draw_text(
                            &font,
                            &mut image,
                            lesson["lesson_name"].as_str().unwrap(),
                            28f32,
                            1,
                            311,
                        );
                    }
                    Weekday::Wed => {
                        draw_text(&font, &mut image, "周三", 36.4, 2, 186);
                        draw_text(
                            &font,
                            &mut image,
                            lesson["lesson_name"].as_str().unwrap(),
                            28f32,
                            2,
                            311,
                        );
                    }
                    Weekday::Thu => {
                        draw_text(&font, &mut image, "周四", 36.4, 3, 186);
                        draw_text(
                            &font,
                            &mut image,
                            lesson["lesson_name"].as_str().unwrap(),
                            28f32,
                            3,
                            311,
                        );
                    }
                    Weekday::Fri => {
                        draw_text(&font, &mut image, "周五", 36.4, 4, 186);
                        draw_text(
                            &font,
                            &mut image,
                            lesson["lesson_name"].as_str().unwrap(),
                            28f32,
                            4,
                            311,
                        );
                    }
                    Weekday::Sat => {
                        draw_text(&font, &mut image, "周六", 36.4, 5, 186);
                        draw_text(
                            &font,
                            &mut image,
                            lesson["lesson_name"].as_str().unwrap(),
                            28f32,
                            5,
                            311,
                        );
                    }
                    Weekday::Sun => {}
                }
            } else {
                match dt.weekday() {
                    Weekday::Mon => {
                        draw_text(
                            &font,
                            &mut image,
                            lesson["lesson_name"].as_str().unwrap(),
                            28f32,
                            0,
                            446,
                        );
                    }
                    Weekday::Tue => {
                        draw_text(
                            &font,
                            &mut image,
                            lesson["lesson_name"].as_str().unwrap(),
                            28f32,
                            1,
                            446,
                        );
                    }
                    Weekday::Wed => {
                        draw_text(
                            &font,
                            &mut image,
                            lesson["lesson_name"].as_str().unwrap(),
                            28f32,
                            2,
                            446,
                        );
                    }
                    Weekday::Thu => {
                        draw_text(
                            &font,
                            &mut image,
                            lesson["lesson_name"].as_str().unwrap(),
                            28f32,
                            3,
                            446,
                        );
                    }
                    Weekday::Fri => {
                        draw_text(
                            &font,
                            &mut image,
                            lesson["lesson_name"].as_str().unwrap(),
                            28f32,
                            4,
                            446,
                        );
                    }
                    Weekday::Sat => {
                        draw_text(
                            &font,
                            &mut image,
                            lesson["lesson_name"].as_str().unwrap(),
                            28f32,
                            5,
                            446,
                        );
                    }
                    Weekday::Sun => {}
                }
            }
        }
    }
    // http://127.0.0.1:8002/yoga/admin/schedule

    let mut bytes: Vec<u8> = Vec::new();
    let _ = image.write_to(&mut Cursor::new(&mut bytes), image::ImageOutputFormat::Png);
    Ok(bytes)
}

// http://127.0.0.1:8002/yoga/admin/schedule
// 28f32,0, 446,
// 22.4,0,478
fn draw_text(font: &Font, image: &mut DynamicImage, text: &str, font_size: f32, x: i32, y: i32) {
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
