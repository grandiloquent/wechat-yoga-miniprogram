```pgsql
select pg_get_functiondef(oid) from pg_proc where proname = 'v1_teacher_lessons';
```
                
```
CREATE OR REPLACE FUNCTION fn_teacher_lessons(input_start_time integer, input_end_time integer, input_open_id text,
                                              input_class_type integer, input_teacher_id integer)
    RETURNS json
    LANGUAGE sql
AS
$function$
select json_build_object(
               'teacher',
               (select row_to_json(r) from (select name, thumbnail from coach where id = input_teacher_id) r),
           'lessons', (select json_agg(t)
                         from (select course.id                                 as course_id,
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
                                      l.name                                    as lesson_name
                               from course
                                        join lesson l on l.id = course.lesson_id
                               where coalesce(course.hidden, 0) = 0
                                 and course.date_time >= input_start_time
                                 and course.date_time < input_end_time
                                 and course.class_type & input_class_type = course.class_type
                                 and teacher_id = input_teacher_id) as t))
$function$
```

```
select * from fn_teacher_lessons(1684252800,1684857600,'oQOVx5Dxk0E6NQO-Ojoyuky2GVR8',4,3);
```
                



                

                
