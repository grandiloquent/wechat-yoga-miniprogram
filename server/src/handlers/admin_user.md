```pgsql
select pg_get_functiondef(oid) from pg_proc where proname = 'fn_admin_users_all';
```

```pgsql
CREATE OR REPLACE FUNCTION fn_admin_user_lessons(in_id integer, in_start bigint, int_end bigint)
 RETURNS json
 LANGUAGE sql
AS $function$
select json_agg(t)
from (
         select r.id,
                c.date_time,
                c.class_type,
                c.start_time,
                c.end_time,
                l.name  lesson_name,
                c2.name teacher_name,
                c2.thumbnail
         from reservation r
                  join "user" u on u.id = r.user_id
                  join course c on c.id = r.course_id
                  join lesson l on l.id = c.lesson_id
                  join coach c2 on c.teacher_id = c2.id
         where u.id = in_id
           and case
                   when in_start = 0 then true
                   else date_time >= in_start and date_time < int_end
             end
    order by date_time desc
     ) as t
$function$

```

```
CREATE OR REPLACE FUNCTION public.fn_admin_users_all(in_open_id text)
    RETURNS json
    LANGUAGE sql
AS
$function$
select case
           when user_type = 4 then (select json_agg(t)
                                    from (select u.id,
                                                 nick_name,
                                                 avatar_url,
                                                 u.creation_time
                                          from "user" u
                                          where u.user_type is null
                                             or (u.user_type <> -1 and u.user_type <> 4)) t)
           END
from "user"
where open_id = in_open_id;

$function$;
```