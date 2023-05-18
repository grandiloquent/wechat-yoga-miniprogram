```
select pg_get_functiondef(oid) from pg_proc where proname = 'v1_admin_lessons_update'
```

```pgsql
CREATE OR REPLACE FUNCTION fn_admin_lessons_update(obj json)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
declare
    v_class_type integer;
    v_start_time integer;
    v_end_time   integer;
    v_lesson_id  integer=0;
    v_teacher_id integer=0;
    v_date_time  bigint;
    v_peoples    integer;
    v_count      integer;
    v_week       integer;
BEGIN

    -- 团课 4 私教 2 小班 1
    v_class_type = coalesce(nullif((obj ->> 'class_type')::integer, 0), 4);
    v_start_time = coalesce(nullif((obj ->> 'start_time')::integer, 0), 0);
    v_end_time = coalesce(nullif((obj ->> 'end_time')::integer, 0), 0);
    v_peoples = coalesce(nullif((obj ->> 'peoples')::bigint, 0), 0);
    v_week = coalesce(nullif((obj ->> 'date_time')::integer, 0), 0);
    select id into v_lesson_id from lesson where name = obj ->> 'lesson' limit 1;
    if v_lesson_id = 0 then
        return -1;
    end if;
    select id into v_teacher_id from coach where name = obj ->> 'teacher' limit 1;
    if v_teacher_id = 0 then
        return -1;
    end if;

    for v_date_time in
        select floor(extract(epoch from d at time zone 'Asia/Shanghai'))
        from generate_series(date_trunc('day', now() at time zone 'Asia/Shanghai'),
                             date_trunc('day', now() at time zone 'Asia/Shanghai') + interval '1 year',
                             interval '1 day') as d
        where extract(dow from d) = v_week
        loop
            insert into course(class_type, lesson_id, date_time, end_time, peoples, start_time, teacher_id,
                               creation_time, updated_time)
            values (v_class_type, v_lesson_id, v_date_time, v_end_time, v_peoples, v_start_time,
                    v_teacher_id, (select unix()), (select unix()));
        end loop;
    return v_count;
end;
$function$

```


```
delete from course where start_time = 5400
```