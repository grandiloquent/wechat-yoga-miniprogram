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

```pgsql
CREATE OR REPLACE FUNCTION fn_book(input_course_id integer, input_open_id text)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
-- 插入结果码：指示是否成功插入，或者插入失败的原因
    result_id     integer = 0;
-- 课程的日期（以秒为单位，不包括点钟、分钟、秒钟的时间戳）
    date_time     bigint;
    now_date_time bigint;
-- 开始上课的时间
    v_start_time  int;
-- 学员的类型
    v_user_type   int ;
-- 学员的标识
    v_user_id     int;
    seconds       bigint;
    r             record;
BEGIN
    --  检查学员是否被屏蔽
    -- 通过微信标识从学员表中查找用户标识和类型
    select id, user_type into v_user_id,v_user_type from "user" where open_id = input_open_id;
    -- 类型-1：已屏蔽的学员
    if v_user_type = -1 then
        return -100;
    end if;
    -- 通过课程标识查询
    -- 课程的日期，开课时间
    select c.date_time, start_time
    into date_time,v_start_time
    from course c
    where c.id = input_course_id
    limit 1;

    select floor(extract(epoch from now())) into seconds;
    INSERT INTO reservation
        (course_id, fulfill, user_id, creation_time, updated_time, vc_id)
    VALUES (input_course_id,
            0,
            v_user_id, seconds, seconds,
            0)
    RETURNING id into result_id;

    /*
    with t as (
        select floor(date_part('epoch', now()))::integer as s
    )
    select (t.s - 8 * 3600) - t.s % (3600 * 24)
    into now_date_time
    from t;
    -- 获取当前时间戳
    select floor(extract(epoch from now())) into seconds;
    for r in select *
             from vip_card
             where user_id = v_user_id
               -- start_date = 0 未生效
               -- end_date > (select locale_current_date()) 有效期
               -- hidden=1 已过有效期 hidden=2 次数已用完
               and (nullif(start_date, 0) is null or end_date > now_date_time)
               and nullif(vip_card.hidden, 0) is null
        loop
            if nullif(r.start_date, 0) is null then
                update vip_card
                set start_date=date_time,
                    end_date=date_time + case
                                             when r.card_id = 1 then 3600 * 24 * 7
                                             when r.card_id = 2 then 3600 * 24 * 30
                                             when r.card_id = 3 then 3600 * 24 * 365
                                             else 3600 * 24 * 180
                        end
                where id = r.id;
                INSERT INTO reservation
                    (course_id, fulfill, user_id, creation_time, updated_time, vc_id)
                VALUES (input_course_id,
                        0,
                        v_user_id, seconds, seconds,
                        r.id)
                RETURNING id into result_id;
                exit;
            end if;
            -- 4 次卡
            -- fulfill = 1 有效的约课
            -- r.times 可选课次数
            if r.card_id = 4 then
                if r.times > (select count(reservation.id)
                              from reservation
                              where vc_id = r.id
                                and fulfill = 1)
                    + (select count(reservation.id)
                       from reservation
                                join course c2 on c2.id = reservation.course_id
                       where vc_id = r.id
                         and fulfill <> 1
                         and c2.date_time >= now_date_time) then
                    INSERT INTO reservation
                        (course_id, fulfill, user_id, creation_time, updated_time, vc_id)
                    VALUES (input_course_id,
                            0,
                            v_user_id, seconds, seconds,
                            r.id)
                    RETURNING id into result_id;
                    exit;
                end if;
            else
                INSERT INTO reservation
                    (course_id, fulfill, user_id, creation_time, updated_time, vc_id)
                VALUES (input_course_id,
                        0,
                        v_user_id, seconds, seconds,
                        r.id)
                RETURNING id into result_id;
            end if;
        end loop;
    */
    RETURN result_id;
END;
$function$
```