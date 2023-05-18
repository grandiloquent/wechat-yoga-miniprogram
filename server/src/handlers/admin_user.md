```pgsql
select pg_get_functiondef(oid) from pg_proc where proname = 'v1_admin_users_all';
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