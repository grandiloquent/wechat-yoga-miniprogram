```pgsql
select pg_get_functiondef(oid) from pg_proc where proname = 'query_week_lessons';
```

```pgsql
drop FUNCTION fn_query_week_lessons;
```              

```pgsql
CREATE OR REPLACE FUNCTION fn_query_week_lessons()
    RETURNS json
    LANGUAGE plpgsql
AS
$function$
DECLARE
    seconds      int;
    date_seconds int;
    week         int;
    date_times   int[];
    obj          json;
BEGIN
    select floor(extract(epoch from now())) into seconds;
    date_seconds = seconds - seconds % 86400 - 28800;
    select extract(dow from now()) into week;
    raise notice 'Date values: % = % = %',seconds,date_seconds,week;
    if week = 0 then
        date_seconds = date_seconds + 86400;
    else
        date_seconds = date_seconds - 86400 * (week - 1);
    end if;
    FOR i in 0..6
        LOOP
            date_times = array_append(date_times, date_seconds + 86400 * i);
        end loop;
    select json_agg(r) into obj
    from (select course.start_time,
                 course.end_time,
                 course.date_time,
                 l.name as lesson_name,
                 c.name as teacher_name
          from course
                   join lesson l on l.id = course.lesson_id
                   join coach c on course.teacher_id = c.id
          where  COALESCE( course.hidden,0)=0 and
            --course.date_time >= 1665158400 and course.date_time <= (1665158400 + 86400* 6)
              course.date_time = ANY (date_times)
            and course.class_type = 4
          order by date_time, start_time) r;
    return obj;
END
$function$
```
 
```pgsql
select * from fn_query_week_lessons();
```
