use crate::utils::data::query_json;
use deadpool_postgres::Pool;
use rocket::http::Status;
use rocket::State;
/// ```pgsql
/// create or replace function fn_index() returns json
///     language sql
/// as
/// $$
/// select jsonb_build_object('poster', (select json_agg(t)
///                                      from (
///                                               select id,
///                                                      image
///                                               from slideshow
///                                           ) t),
///                           'booked', (select json_agg(t)
///                                      from (
///                                               select reservation.id as id,
///                                                      u.nick_name    as nick_name,
///                                                      u.avatar_url   as avatar_url
///                                               from reservation
///                                                        join "user" u on u.id = reservation.user_id
///                                               where reservation.id in (select max(reservation.id)
///                                                                        from reservation
///                                                                        group by reservation.user_id)
///                                               order by reservation.creation_time desc
///                                               limit 10
///                                           ) t),
///                           'actions', (select json_agg(t)
///                                       from (
///                                                select id,
///                                                       name,
///                                                       image
///                                                from function
///                                                order by id
///                                            ) t),
///                           'teachers', (select json_agg(jsonb_build_object('id', id,
///                                                                           'name', name,
///                                                                           'thumbnail', thumbnail,
///                                                                           'introduction', introduction
///             ))
///                                        from coach)
///            ,
///                           'market', (select row_to_json(t)
///                                      from (
///                                               select id,
///                                                      slogan
///                                               from market
///                                               order by updated_time desc
///                                               limit 1
///                                           ) as t),
///                           'notices', (select json_agg(t)
///                                       from (
///                                                select id,
///                                                       title,
///                                                       updated_time
///                                                from announcement
///                                                order by updated_time desc
///                                                limit 3
///                                            ) as t)
///            );
/// $$;
/// ```
#[get("/index")]
pub async fn index(pool: &State<Pool>) -> Result<String, Status> {
    match pool.get().await {
        Ok(conn) => match query_json(&conn, "select * from fn_index()").await {
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
}
