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

```pgsql
select pg_get_functiondef(oid) from pg_proc where proname = 'v1_admin_lesson_update';
```
                
```
CREATE OR REPLACE FUNCTION fn_admin_lesson_update(obj json)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
declare
    v_course_id      integer;
    v_id             integer;
    v_lesson_id      integer;
    v_teacher_id     integer;
    v_class_type     integer;
    v_start_time     integer;
    v_end_time       integer;
    v_peoples        integer;
    v_old_start_time integer;
    v_old_class_type integer;
BEGIN
    v_course_id = nullif((obj ->> 'id')::integer, 0);
    select id into v_lesson_id from lesson where name = obj ->> 'lesson' limit 1;

    select id into v_teacher_id from coach where name = obj ->> 'teacher' limit 1;
    v_class_type = nullif((obj ->> 'class_type')::integer, 0);
    v_start_time = nullif((obj ->> 'start_time')::integer, 0);
    v_end_time = nullif((obj ->> 'end_time')::integer, 0);
    v_peoples = nullif((obj ->> 'peoples')::bigint, 0);
    v_old_start_time = nullif((obj ->> 'old_start_time')::integer, 0);
    v_old_class_type = nullif((obj ->> 'old_class_type')::integer, 0);
    for v_id in select c.id
                from course c,
                     lateral (
                         select date_time
                         from course
                         where id = v_course_id
                         limit 1
                         ) t
                where c.date_time >= t.date_time
                  and (t.date_time - c.date_time) % 7 * 86400 = 0
        loop
            update course
            set lesson_id=coalesce(nullif(v_lesson_id, 0), lesson_id),
                teacher_id=coalesce(nullif(v_teacher_id, 0), teacher_id),
                class_type = coalesce(v_class_type, class_type),
                start_time = coalesce(v_start_time, start_time),
                end_time = coalesce(v_end_time, end_time),
                peoples = coalesce(v_peoples, peoples)
            where id = v_id
              and start_time = v_old_start_time
              and class_type = v_old_class_type;
        end loop;
    return 0;
end;
$function$

```

                
                

                
