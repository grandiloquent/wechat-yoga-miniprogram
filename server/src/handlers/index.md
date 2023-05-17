```pgsql
CREATE OR REPLACE FUNCTION public.fn_index()
 RETURNS json
 LANGUAGE sql
AS $function$
select jsonb_build_object('poster', (select json_agg(t)
                                     from (
                                              select id,
                                                     image
                                              from slideshow
                                          ) t),
                          'booked', (select json_agg(t)
                                     from (
                                              select reservation.id as id,
                                                     u.nick_name    as nick_name,
                                                     u.avatar_url   as avatar_url
                                              from reservation
                                                       join "user" u on u.id = reservation.user_id
                                              where reservation.id in (select max(reservation.id)
                                                                       from reservation
                                                                       group by reservation.user_id)
                                              order by reservation.creation_time desc
                                              limit 10
                                          ) t),
                          'actions', (select json_agg(t)
                                      from (
                                               select id,
                                                      name,
                                                      image
                                               from function
                                               order by id
                                           ) t),
                          'teachers', (select json_agg(jsonb_build_object('id', id,
                                                                          'name', name,
                                                                          'thumbnail', thumbnail,
                                                                          'introduction', introduction
            ))
                                       from coach)
           ,
                          'market', (select row_to_json(t)
                                     from (
                                              select id,
                                                     slogan
                                              from market
                                              order by updated_time desc
                                              limit 1
                                          ) as t),
                          'notices', (select json_agg(t)
                                      from (
                                               select id,
                                                      title,
                                                      updated_time
                                               from announcement
                                               order by updated_time desc
                                               limit 3
                                           ) as t)
           );
$function$
```

```
select * from fn_index();
```