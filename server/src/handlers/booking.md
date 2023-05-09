```pgsql
select pg_get_functiondef(oid)
from pg_proc
where proname = 'v1_booking_query';
```

```pgsql
CREATE OR REPLACE FUNCTION fn_lessons_next_two_weeks(input_date_time integer, input_open_id text, input_class_type integer)
 RETURNS json
 LANGUAGE sql
AS $function$
select json_agg(t)
from (
         select course.id                                 as course_id,
                course.peoples,
                (select count(reservation.id)
                 from reservation
                 where reservation.course_id = course.id) as count,
                (select reservation.id
                 from reservation
                          join "user" u on u.id = reservation.user_id
                 where u.open_id = input_open_id
                   and reservation.course_id = course.id
                 limit 1)                                 as reservation_id,
                course.start_time,
                course.end_time,
                course.date_time,
                l.name                                    as lesson_name,
                c.name                                    as teacher_name,
                c.thumbnail,
                course.hidden
         from course
                  join coach c on course.teacher_id = c.id
                  join lesson l on l.id = course.lesson_id
         where coalesce(course.hidden, 0) <> 1
           and course.date_time = input_date_time
           and course.class_type & input_class_type = course.class_type
     ) as t
$function$
```
