```
CREATE OR REPLACE FUNCTION fn_admin_lessons(input_start_time integer, input_end_time integer, input_class_type integer)
 RETURNS json
 LANGUAGE sql
AS $function$
select json_agg(t)
from (select course.id                                 as course_id,
             course.peoples,
             (select count(reservation.id)
              from reservation
              where reservation.course_id = course.id) as count,
             course.start_time,
             course.end_time,
             course.date_time,
             l.name                                    as lesson_name,
             c.name                                    as teacher_name,
             c.thumbnail,
             course.hidden,
             course.class_type
      from course
               join coach c on course.teacher_id = c.id
               join lesson l on l.id = course.lesson_id
      where course.date_time >= input_start_time
        and course.date_time < input_end_time
        and course.class_type & input_class_type = course.class_type)
         as t;

$function$

```

```
CREATE OR REPLACE FUNCTION fn_admin_lesson_update_status(in_id integer, in_value integer)
RETURNS integer
LANGUAGE sql
AS $function$
update course
set hidden=in_value
where id = in_id
returning id;
$function$
```

```
select json_agg(r)
from (select coach.name as teachers, lesson.name as lessons
      from coach
               cross join lateral
          (select name
           from lesson) as lesson) r;
```

```
drop FUNCTION fn_admin_lessons_and_teachers()
```

```
CREATE OR REPLACE FUNCTION fn_admin_lessons_and_teachers(in_id integer)
    RETURNS json
    LANGUAGE sql
AS
$function$
select json_build_object('lessons', (select json_agg(name) from lesson),
                         'teachers', (select json_agg(name) from coach),
                         'lesson',
                         (select row_to_json(r)
                          from (select l.peoples, l.start_time, l.class_type, l2.name lesson_name, c.name teacher_name
                                from course l
                                         join lesson l2 on l2.id = l.lesson_id
                                         join coach c on c.id = l.teacher_id
                                where l.id = in_id) r));
$function$
```
                
```
select * from fn_admin_lessons_and_teachers(1323);
```

                

                
