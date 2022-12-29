--
-- PostgreSQL database dump
--

-- Dumped from database version 14.4 (Ubuntu 14.4-1.pgdg20.04+1)
-- Dumped by pg_dump version 15.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: check_user_password(text, text); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.check_user_password(in_phone_number text, in_password text) RETURNS integer
    LANGUAGE sql
    AS $$
select id
from userinfo
where phone_number = in_phone_number
  and password = in_password;
$$;


ALTER FUNCTION public.check_user_password(in_phone_number text, in_password text) OWNER TO psycho;

--
-- Name: seconds(); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.seconds() RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    seconds int;
BEGIN
    seconds = floor(extract(epoch from now())) - date_seconds();
    seconds = seconds - seconds % 60;
    return seconds;
END;
$$;


ALTER FUNCTION public.seconds() OWNER TO psycho;

--
-- Name: unix(); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.unix() RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
    seconds bigint;
BEGIN
    -- select floor(extract(epoch from timestamptz(now()))) into seconds;
    select floor(extract(epoch from now())) into seconds;
    RETURN seconds;
END;
$$;


ALTER FUNCTION public.unix() OWNER TO psycho;

--
-- Name: v1_admin_course(integer); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.v1_admin_course(in_id integer) RETURNS json
    LANGUAGE sql
    AS $$
select row_to_json(t)
from (
         select *
         from lesson
         where in_id = 1
         limit 1) as t
$$;


ALTER FUNCTION public.v1_admin_course(in_id integer) OWNER TO psycho;

--
-- Name: v1_admin_course_update(json); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.v1_admin_course_update(obj json) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    result_id integer=0;
    seconds   bigint;
BEGIN
    select floor(extract(epoch from now())) into seconds;
    insert into lesson(id, description, image, name, creation_time, updated_time)
    values (coalesce(NULLIF((obj ->> 'id')::int, 0), coalesce((select max(id) from lesson), 0) + 1),
            obj ->> 'description',
            obj ->> 'image',
            obj ->> 'name'
               , coalesce(NULLIF((obj ->> 'create_at')::bigint, 0), seconds),
            coalesce(NULLIF((obj ->> 'update_at')::bigint, 0), seconds))
    ON CONFLICT (id) DO update
        set description   = coalesce(obj ->> 'description', lesson.description),
            image         = coalesce(obj ->> 'image', lesson.image),
            name          = coalesce(obj ->> 'name', lesson.name)
                ,
            creation_time = coalesce(NULLIF((obj ->> 'creation_time')::bigint, 0), lesson.creation_time),
            updated_time  = seconds
    returning id into result_id;
    RETURN result_id;
END;
$$;


ALTER FUNCTION public.v1_admin_course_update(obj json) OWNER TO psycho;

--
-- Name: v1_admin_lesson(integer); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.v1_admin_lesson(in_id integer) RETURNS json
    LANGUAGE sql
    AS $$
with u as
         (
             select json_agg(x)
             from (
                      select reservation.id reservation_id,
                             reservation.creation_time,
                             u2.id,
                             u2.nick_name,
                             u2.avatar_url
                      from reservation
                               join "user" u2 on u2.id = reservation.user_id
                      where course_id = in_id
                  ) x
         )
select row_to_json(t)
from (
         select c.hidden,
                c.peoples,
                c.date_time,
                c.start_time,
                c.end_time,
                c2.thumbnail,
                c.class_type,
                l.name               lesson_name,
                c2.name              teacher_name,
                (select * from u) as students
         from course c
                  join lesson l on l.id = c.lesson_id
                  join coach c2 on c.teacher_id = c2.id
         where c.id = in_id
         limit 1) as t
$$;


ALTER FUNCTION public.v1_admin_lesson(in_id integer) OWNER TO psycho;

--
-- Name: v1_admin_lesson_info(); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.v1_admin_lesson_info() RETURNS json
    LANGUAGE sql
    AS $$
with t as (
    select json_agg(name) teachers
    from coach
),
     v as (
         select json_agg(name) lessons
         from lesson
     )
select row_to_json(t)
from (
         select teachers, lessons
         from t
                  cross join v) as t
$$;


ALTER FUNCTION public.v1_admin_lesson_info() OWNER TO psycho;

--
-- Name: v1_admin_lesson_names(); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.v1_admin_lesson_names() RETURNS json
    LANGUAGE sql
    AS $$
select json_agg(t)
from (
         select id, name
         from lesson) as t
$$;


ALTER FUNCTION public.v1_admin_lesson_names() OWNER TO psycho;

--
-- Name: v1_admin_lessons(integer, integer, integer); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.v1_admin_lessons(input_start_time integer, input_end_time integer, input_class_type integer) RETURNS json
    LANGUAGE sql
    AS $$
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

$$;


ALTER FUNCTION public.v1_admin_lessons(input_start_time integer, input_end_time integer, input_class_type integer) OWNER TO psycho;

--
-- Name: v1_admin_lessons_update(json); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.v1_admin_lessons_update(obj json) RETURNS integer
    LANGUAGE plpgsql
    AS $$
declare
    v_class_type integer;
    v_start_time integer;
    v_end_time   integer;
    v_lesson_id  integer;
    v_teacher_id integer;
    v_date_time  bigint;
    v_peoples    integer;
    v_count      integer;
    v_week       integer;
    v_start      bigint;
    v_end        bigint;
BEGIN

    -- 团课 4 私教 2 小班 1
    v_class_type = coalesce(nullif((obj ->> 'class_type')::integer, 0), 4);
    v_start_time = coalesce(nullif((obj ->> 'start_time')::integer, 0), 0);
    v_end_time = coalesce(nullif((obj ->> 'end_time')::integer, 0), 0);
    v_peoples = coalesce(nullif((obj ->> 'peoples')::bigint, 0), 0);
    v_week = coalesce(nullif((obj ->> 'date_time')::integer, 0), 0);
    v_start = (select extract(epoch from current_date) - 8 * 3600);
    v_end = (select extract(epoch from current_date + interval '1 year') - 8 * 3600);
    select id into v_lesson_id from lesson where name = obj ->> 'lesson' limit 1;
    select id into v_teacher_id from coach where name = obj ->> 'teacher' limit 1;
    for v_date_time in
        SELECT extract(epoch from days AT TIME ZONE 'CCT')
        FROM generate_series(to_timestamp(v_start), to_timestamp(v_end), '1 day' :: interval) AS days
        where EXTRACT(dow FROM days) = v_week
        loop
            insert into course(class_type, lesson_id, date_time, end_time, peoples, start_time, teacher_id,
                               creation_time, updated_time)
            values (v_class_type, v_lesson_id, v_date_time- 8 * 3600, v_end_time, v_peoples, v_start_time,
                    v_teacher_id,(select unix()), (select unix()));
        end loop;
    return v_count;
end;
$$;


ALTER FUNCTION public.v1_admin_lessons_update(obj json) OWNER TO psycho;

--
-- Name: v1_admin_market(); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.v1_admin_market() RETURNS json
    LANGUAGE sql
    AS $$
select row_to_json(t)
from (
         select *
         from market
         limit 1
     ) as t
$$;


ALTER FUNCTION public.v1_admin_market() OWNER TO psycho;

--
-- Name: v1_admin_market_update(json); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.v1_admin_market_update(obj json) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    result_id integer=0;
    seconds   bigint;
BEGIN
    select floor(extract(epoch from now())) into seconds;
    insert into market(id,content,title,slogan,creation_time,updated_time)
    values (coalesce(NULLIF((obj ->>  'id')::int, 0), coalesce((select max(id) from market), 0) + 1),
     obj ->> 'content',
 obj ->> 'title',
 obj ->> 'slogan'
        ,coalesce(NULLIF((obj ->>  'create_at')::bigint, 0), seconds),
        coalesce(NULLIF((obj ->>  'update_at')::bigint, 0), seconds)
        )
        ON CONFLICT (id) DO update
            set
            content = coalesce(obj ->>'content',market.content),
title = coalesce(obj ->>'title',market.title),
slogan = coalesce(obj ->>'slogan',market.slogan)
            ,creation_time = coalesce(NULLIF((obj ->>  'creation_time')::bigint, 0), market.creation_time),
                updated_time  = seconds
            returning id into result_id;
        RETURN result_id;
        END;
$$;


ALTER FUNCTION public.v1_admin_market_update(obj json) OWNER TO psycho;

--
-- Name: v1_admin_note(integer); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.v1_admin_note(in_id integer) RETURNS json
    LANGUAGE sql
    AS $$
select row_to_json(t)
from (
         select *
         from note
         where id = in_id
         limit 1) as t
$$;


ALTER FUNCTION public.v1_admin_note(in_id integer) OWNER TO psycho;

--
-- Name: v1_admin_note_update(json); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.v1_admin_note_update(obj json) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    result_id integer=0;
    seconds   bigint;
BEGIN
    select floor(extract(epoch from now())) into seconds;
    insert into note(id,title,
content,
hidden,
policy,creation_time,updated_time)
    values (coalesce(NULLIF((obj ->>  'id')::int, 0), coalesce((select max(id) from note), 0) + 1),
     obj ->> 'title',
 obj ->> 'content',
 (obj ->> 'hidden')::integer,
 (obj ->> 'policy')::integer
        ,coalesce(NULLIF((obj ->>  'create_at')::bigint, 0), seconds),
        coalesce(NULLIF((obj ->>  'update_at')::bigint, 0), seconds)
        )
        ON CONFLICT (id) DO update
            set
            title = coalesce(obj ->>'title',note.title),
content = coalesce(obj ->>'content',note.content),
hidden = coalesce(NULLIF((obj ->>'hidden')::integer, 0),note.hidden),
policy = coalesce(NULLIF((obj ->>'policy')::integer, 0),note.policy)
            ,creation_time = coalesce(NULLIF((obj ->>  'creation_time')::bigint, 0), note.creation_time),
                updated_time  = seconds
            returning id into result_id;
        RETURN result_id;
        END;
$$;


ALTER FUNCTION public.v1_admin_note_update(obj json) OWNER TO psycho;

--
-- Name: v1_admin_notes(); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.v1_admin_notes() RETURNS json
    LANGUAGE sql
    AS $$
select json_agg(t)
from (
         select id,
                title,
                updated_time
         from note
         order by updated_time desc
     ) as t
$$;


ALTER FUNCTION public.v1_admin_notes() OWNER TO psycho;

--
-- Name: v1_admin_notice(integer); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.v1_admin_notice(in_id integer) RETURNS json
    LANGUAGE sql
    AS $$
select row_to_json(t)
from (
         select *
         from announcement
         where id = in_id
         limit 1) as t
$$;


ALTER FUNCTION public.v1_admin_notice(in_id integer) OWNER TO psycho;

--
-- Name: v1_admin_notice_delete(integer); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.v1_admin_notice_delete(in_id integer) RETURNS integer
    LANGUAGE sql
    AS $$
delete
from announcement
where id = in_id
returning id;
$$;


ALTER FUNCTION public.v1_admin_notice_delete(in_id integer) OWNER TO psycho;

--
-- Name: v1_admin_notice_update(json); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.v1_admin_notice_update(obj json) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    result_id integer=0;
    seconds   bigint;
BEGIN
    select floor(extract(epoch from now())) into seconds;
    insert into announcement(id, content,
                             title, creation_time, updated_time)
    values (coalesce(NULLIF((obj ->> 'id')::int, 0), coalesce((select max(id) from announcement), 0) + 1),
            obj ->> 'content',
            obj ->> 'title'
               , coalesce(NULLIF((obj ->> 'create_at')::bigint, 0), seconds),
            coalesce(NULLIF((obj ->> 'update_at')::bigint, 0), seconds))
    ON CONFLICT (id) DO update
        set content       = coalesce(obj ->> 'content', announcement.content),
            title         = coalesce(obj ->> 'title', announcement.title)
                ,
            creation_time = coalesce(NULLIF((obj ->> 'creation_time')::bigint, 0), announcement.creation_time),
            updated_time  = seconds
    returning id into result_id;
    RETURN result_id;
END;
$$;


ALTER FUNCTION public.v1_admin_notice_update(obj json) OWNER TO psycho;

--
-- Name: v1_admin_notices(); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.v1_admin_notices() RETURNS json
    LANGUAGE sql
    AS $$
select json_agg(t)
from (
         select id,
                title
         from announcement
         order by updated_time desc
     ) as t
$$;


ALTER FUNCTION public.v1_admin_notices() OWNER TO psycho;

--
-- Name: v1_admin_teacher(integer); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.v1_admin_teacher(in_id integer) RETURNS json
    LANGUAGE sql
    AS $$
select row_to_json(t)
from (
         select *
         from coach
         where id = in_id
         limit 1) as t
$$;


ALTER FUNCTION public.v1_admin_teacher(in_id integer) OWNER TO psycho;

--
-- Name: v1_admin_teacher_update(json); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.v1_admin_teacher_update(obj json) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    result_id integer=0;
    seconds   bigint;
BEGIN
    select floor(extract(epoch from now())) into seconds;
    insert into coach(id,description,introduction,name,open_id,phone_number,thumbnail,coach_type,creation_time,updated_time)
    values (coalesce(NULLIF((obj ->>  'id')::int, 0), coalesce((select max(id) from coach), 0) + 1),
     obj ->> 'description',
 obj ->> 'introduction',
 obj ->> 'name',
 obj ->> 'open_id',
 obj ->> 'phone_number',
 obj ->> 'thumbnail',
 obj ->> 'coach_type'
        ,coalesce(NULLIF((obj ->>  'create_at')::bigint, 0), seconds),
        coalesce(NULLIF((obj ->>  'update_at')::bigint, 0), seconds)
        )
        ON CONFLICT (id) DO update
            set
            description = coalesce(obj ->>'description',coach.description),
introduction = coalesce(obj ->>'introduction',coach.introduction),
name = coalesce(obj ->>'name',coach.name),
open_id = coalesce(obj ->>'open_id',coach.open_id),
phone_number = coalesce(obj ->>'phone_number',coach.phone_number),
thumbnail = coalesce(obj ->>'thumbnail',coach.thumbnail),
coach_type = coalesce(obj ->>'coach_type',coach.coach_type)
            ,creation_time = coalesce(NULLIF((obj ->>  'creation_time')::bigint, 0), coach.creation_time),
                updated_time  = seconds
            returning id into result_id;
        RETURN result_id;
        END;
$$;


ALTER FUNCTION public.v1_admin_teacher_update(obj json) OWNER TO psycho;

--
-- Name: v1_admin_teachers(); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.v1_admin_teachers() RETURNS json
    LANGUAGE sql
    AS $$
select json_agg(t)
from (
         select *
         from coach) as t
$$;


ALTER FUNCTION public.v1_admin_teachers() OWNER TO psycho;

--
-- Name: v1_admin_users(); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.v1_admin_users() RETURNS json
    LANGUAGE sql
    AS $$
select json_agg(t)
from (select u.id,
             nick_name,
             avatar_url,
             u.creation_time,
             (select count(reservation.id) from reservation where reservation.user_id = u.id) booked,

             (select reservation.creation_time
              from reservation
              where reservation.user_id = u.id
              order by reservation.creation_time desc
              limit 1)                                                                        lasted,
             (select card_id
              from vip_card
              where vip_card.user_id = u.id
              order by vip_card.creation_time desc
              limit 1)                                                                        card_id
      from "user" u
      where u.user_type is null
         or (u.user_type <> -1 and u.user_type <> 4)
    order by lasted desc
     ) t
where t.booked > 0
  and t.lasted > (unix() - 86400 * 15)

$$;


ALTER FUNCTION public.v1_admin_users() OWNER TO psycho;

--
-- Name: v1_book(integer, text); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.v1_book(input_course_id integer, input_open_id text) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE

--****************************************--
-- 变量列表
--****************************************--

-- 插入结果码：指示是否成功插入，或者插入失败的原因
    result_id         integer;

-- 已预约该课程的学员人数
    booked            int;

-- 课程的日期（以秒为单位，不包括点钟、分钟、秒钟的时间戳）
    date_time         int;

-- 课程预设的学员数
    peoples           int;

-- 会员卡标识
    v_vc_id           int;

-- 开始上课的时间
    v_start_time      int;

-- 学员的类型
    v_user_type       int ;

-- 学员的标识
    v_user_id         int;

    seconds           bigint;
BEGIN

    --  检查学员是否被屏蔽
    -- 通过微信标识从学员表中查找用户标识和类型
    select id, user_type into v_user_id,v_user_type from "user" where open_id = input_open_id;

    -- 类型-1：已屏蔽的学员
    if v_user_type = -1 then
        return -100;
    end if;


    -- 检查课程是否已满额

    -- 通过课程标识从课程和预约表中，查找已预约该课程的学员人数，课程预设的人数，课程的日期，课程开始的时间
    select course.peoples, course.date_time, start_time
    into peoples,date_time,v_start_time
    from course
    where id = input_course_id
    limit 1;

    select count(*) into booked from reservation where course_id = input_course_id;

    if booked >= peoples then
        return -101;
    end if;
    select unix() into seconds;
    INSERT INTO reservation
        (course_id, fulfill, user_id, creation_time, updated_time, vc_id)
    VALUES (input_course_id,
            0,
            v_user_id, seconds, seconds,
            v_vc_id)
    RETURNING id into result_id;
    RETURN result_id;
END;
$$;


ALTER FUNCTION public.v1_book(input_course_id integer, input_open_id text) OWNER TO psycho;

--
-- Name: v1_booked_home(); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.v1_booked_home() RETURNS json
    LANGUAGE sql
    AS $$
select json_agg(t)
from (
         select reservation.id as id, u.nick_name as nick_name, u.avatar_url as avatar_url
         from reservation
                  join "user" u on u.id = reservation.user_id
         where reservation.id in (select max(reservation.id) from reservation group by reservation.user_id)
         order by reservation.creation_time desc
         limit 10
     ) as t
$$;


ALTER FUNCTION public.v1_booked_home() OWNER TO psycho;

--
-- Name: v1_booked_query(text, integer, integer); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.v1_booked_query(in_open_id text, in_start integer, in_end integer) RETURNS json
    LANGUAGE sql
    AS $$
select json_agg(t)
from (
         select c.id,
                r.id reservation_id,
                l.name lesson_name,
                coach.name teacher_name,
                coach.thumbnail,
                c.start_time,
                c.end_time,
                c.date_time,
                c.class_type
         from course c
                  join reservation r on c.id = r.course_id
                  join coach on c.teacher_id = coach.id
                  join lesson l on l.id = c.lesson_id
                  join "user" u on u.id = r.user_id
         where u.open_id = in_open_id
           and date_time >= in_start
           and date_time < in_end
     ) as t
$$;


ALTER FUNCTION public.v1_booked_query(in_open_id text, in_start integer, in_end integer) OWNER TO psycho;

--
-- Name: v1_booking_query(integer, text, integer); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.v1_booking_query(input_date_time integer, input_open_id text, input_class_type integer) RETURNS json
    LANGUAGE sql
    AS $$
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
                        c.thumbnail
                 from course
                          join coach c on course.teacher_id = c.id
                          join lesson l on l.id = course.lesson_id
                 where nullif(course.hidden,0) is null
                   and course.date_time = input_date_time
                   and course.class_type & input_class_type = course.class_type

     ) as t
$$;


ALTER FUNCTION public.v1_booking_query(input_date_time integer, input_open_id text, input_class_type integer) OWNER TO psycho;

--
-- Name: v1_debug(json, text); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.v1_debug(obj json, in_ip text) RETURNS integer
    LANGUAGE plpgsql
    AS $_$
DECLARE
    result_id integer=0;
    seconds   bigint;
BEGIN
    if coalesce(textregexeq(obj ->> 'open_id', '^[a-zA-Z0-9_-]{28}$'), false) = false
        or coalesce(textregexeq(obj ->> 'sdk_version', '^\d+\.\d+\.\d$'), false) = false
        or coalesce(textregexeq(obj ->> 'screen_width', '^\d+$'), false) = false
        or coalesce(textregexeq(obj ->> 'pixel_ratio', '^[\d.]+$'), false) = false
        or obj ->> 'model' = 'iPhone XS MAX China-exclusive<iPhone 11,6>'
    then
        return -1;
    end if;
    select floor(extract(epoch from now())) into seconds;
    insert into systeminfo(id, open_id,
                           sdk_version,
                           brand,
                           model,
                           pixel_ratio,
                           platform,
                           screen_height,
                           screen_width,
                           version,
                           ip,
                           count, creation_time, updated_time)
    values (coalesce(NULLIF((obj ->> 'id')::int, 0), coalesce((select max(id) from systeminfo), 0) + 1),
            obj ->> 'open_id',
            obj ->> 'sdk_version',
            obj ->> 'brand',
            obj ->> 'model',
            obj ->> 'pixel_ratio',
            obj ->> 'platform',
            obj ->> 'screen_height',
            obj ->> 'screen_width',
            obj ->> 'version',
            in_ip,
            coalesce((obj ->> 'count')::int, 1)
               , coalesce(NULLIF((obj ->> 'create_at')::bigint, 0), seconds),
            coalesce(NULLIF((obj ->> 'update_at')::bigint, 0), seconds))
    ON CONFLICT (open_id ) DO update
        set sdk_version   = coalesce(obj ->> 'sdk_version', systeminfo.sdk_version),
            brand         = coalesce(obj ->> 'brand', systeminfo.brand),
            model         = coalesce(obj ->> 'model', systeminfo.model),
            pixel_ratio   = coalesce(obj ->> 'pixel_ratio', systeminfo.pixel_ratio),
            platform      = coalesce(obj ->> 'platform', systeminfo.platform),
            screen_height = coalesce(obj ->> 'screen_height', systeminfo.screen_height),
            screen_width  = coalesce(obj ->> 'screen_width', systeminfo.screen_width),
            version       = coalesce(obj ->> 'version', systeminfo.version),
            ip            = coalesce(in_ip, systeminfo.ip),
            count         = systeminfo.count + 1
                ,
            creation_time = coalesce(NULLIF((obj ->> 'creation_time')::bigint, 0), systeminfo.creation_time),
            updated_time  = seconds
    returning id into result_id;
    RETURN result_id;
END;
$_$;


ALTER FUNCTION public.v1_debug(obj json, in_ip text) OWNER TO psycho;

--
-- Name: v1_functions_home(); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.v1_functions_home() RETURNS json
    LANGUAGE sql
    AS $$
select json_agg(t)
from (
         select id,
                name,
                image
         from function
         order by id
     ) as t
$$;


ALTER FUNCTION public.v1_functions_home() OWNER TO psycho;

--
-- Name: v1_market(); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.v1_market() RETURNS json
    LANGUAGE sql
    AS $$
select row_to_json(t)
from (
         select content, title, updated_time
         from market
         order by updated_time desc
         limit 1
     ) as t
$$;


ALTER FUNCTION public.v1_market() OWNER TO psycho;

--
-- Name: v1_market_home(); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.v1_market_home() RETURNS json
    LANGUAGE sql
    AS $$
select row_to_json(t)
from (
         select id,
                slogan
         from market
         order by updated_time desc
         limit 1
     ) as t
$$;


ALTER FUNCTION public.v1_market_home() OWNER TO psycho;

--
-- Name: v1_notice(integer); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.v1_notice(in_id integer) RETURNS json
    LANGUAGE sql
    AS $$
select row_to_json(t)
from (
         select title,
                content,
                updated_time
         from announcement
         where id = in_id
     ) as t
$$;


ALTER FUNCTION public.v1_notice(in_id integer) OWNER TO psycho;

--
-- Name: v1_notices(); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.v1_notices() RETURNS json
    LANGUAGE sql
    AS $$
select json_agg(t)
from (
         select id,
                title,
                updated_time
         from announcement
         order by updated_time desc
     ) as t
$$;


ALTER FUNCTION public.v1_notices() OWNER TO psycho;

--
-- Name: v1_notices_home(); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.v1_notices_home() RETURNS json
    LANGUAGE sql
    AS $$
select json_agg(t)
from (
         select id,
                title,
                updated_time
         from announcement
         order by updated_time desc 
         limit 3
     ) as t
$$;


ALTER FUNCTION public.v1_notices_home() OWNER TO psycho;

--
-- Name: v1_slideshow_home(); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.v1_slideshow_home() RETURNS json
    LANGUAGE sql
    AS $$
select json_agg(t)
from (
         select id,
                image
         from slideshow
     ) as t
$$;


ALTER FUNCTION public.v1_slideshow_home() OWNER TO psycho;

--
-- Name: v1_teacher(integer); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.v1_teacher(in_id integer) RETURNS json
    LANGUAGE sql
    AS $$
select row_to_json(t)
from (
         select coach.id,
                name,
                thumbnail,
                introduction,
                description,
                count(c.id) filter ( where c.class_type = 4 ) as big,
                count(c.id) filter ( where c.class_type = 2)  as one,
                count(c.id) filter ( where c.class_type = 1 ) as small
         from coach
                  join course c on coach.id = c.teacher_id
         where coach.id = in_id
         group by coach.id
     ) as t
$$;


ALTER FUNCTION public.v1_teacher(in_id integer) OWNER TO psycho;

--
-- Name: v1_teacher_lessons(integer, integer, text, integer, integer); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.v1_teacher_lessons(input_start_time integer, input_end_time integer, input_open_id text, input_class_type integer, input_teacher_id integer) RETURNS json
    LANGUAGE sql
    AS $$
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
                c.thumbnail
         from course
                  join coach c on course.teacher_id = c.id
                  join lesson l on l.id = course.lesson_id
         where course.hidden <> 1
           and course.date_time >= input_start_time
           and course.date_time < input_end_time
           and course.class_type & input_class_type = course.class_type
           and teacher_id = input_teacher_id
     ) as t
$$;


ALTER FUNCTION public.v1_teacher_lessons(input_start_time integer, input_end_time integer, input_open_id text, input_class_type integer, input_teacher_id integer) OWNER TO psycho;

--
-- Name: v1_teachers_home(); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.v1_teachers_home() RETURNS json
    LANGUAGE sql
    AS $$
select json_agg(jsonb_build_object('id', id,
                                   'name', name,
                                   'thumbnail', thumbnail,
                                   'introduction', introduction
    ))
from coach;
$$;


ALTER FUNCTION public.v1_teachers_home() OWNER TO psycho;

--
-- Name: v1_unbook(integer, text); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.v1_unbook(input_reservation_id integer, input_open_id text) RETURNS integer
    LANGUAGE sql
    AS $$
delete
from reservation
where id = input_reservation_id
  and user_id = (select id from "user" where open_id = input_open_id)
returning id;
$$;


ALTER FUNCTION public.v1_unbook(input_reservation_id integer, input_open_id text) OWNER TO psycho;

--
-- Name: v1_user_check(text); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.v1_user_check(in_open_id text) RETURNS integer
    LANGUAGE sql
    AS $$
select id
from "user"
where open_id = in_open_id
limit 1
$$;


ALTER FUNCTION public.v1_user_check(in_open_id text) OWNER TO psycho;

--
-- Name: v1_user_update(json); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.v1_user_update(obj json) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    result_id integer=0;
    seconds   bigint;
BEGIN
    select floor(extract(epoch from now())) into seconds;
    insert into "user" (id, address, avatar_url, gender, name, nick_name, note, open_id, phone, user_type,
                        creation_time, updated_time)
    values (coalesce(NULLIF((obj ->> 'id')::int, 0), coalesce((select max(id) from "user"), 0) + 1),
            obj ->> 'address', obj ->> 'avatar_url', (obj ->> 'gender')::integer, obj ->> 'name', coalesce(obj ->> 'nick_name',''),
            obj ->> 'note', obj ->> 'open_id', obj ->> 'phone', (obj ->> 'user_type')::integer
               , coalesce(NULLIF((obj ->> 'create_at')::bigint, 0), seconds),
            coalesce(NULLIF((obj ->> 'update_at')::bigint, 0), seconds))
    ON CONFLICT (open_id) DO update
        set address= coalesce(obj ->> 'address', "user".address),
            avatar_url= coalesce(obj ->> 'avatar_url', "user".avatar_url),
            gender= coalesce(NULLIF((obj ->> 'gender')::integer, 0), "user".gender),
            name= coalesce(obj ->> 'name', "user".name),
            nick_name= coalesce(obj ->> 'nick_name', "user".nick_name),
            note= coalesce(obj ->> 'note', "user".note),
            open_id= coalesce(obj ->> 'open_id', "user".open_id),
            phone= coalesce(obj ->> 'phone', "user".phone),
            user_type= coalesce(NULLIF((obj ->> 'user_type')::integer, 0), "user".user_type)
                ,
            creation_time = coalesce(NULLIF((obj ->> 'creation_time')::bigint, 0), "user".creation_time),
            updated_time = seconds
    returning id into result_id;
    RETURN result_id;
END;
$$;


ALTER FUNCTION public.v1_user_update(obj json) OWNER TO psycho;

--
-- Name: v1_user_user(text); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.v1_user_user(in_id text) RETURNS json
    LANGUAGE sql
    AS $$
select row_to_json(t)
from (
         select u.id,
                avatar_url,
                nick_name,
                count(c.id) filter ( where c.class_type = 4 ) as big,
                count(c.id) filter ( where c.class_type = 2 ) as one,
                count(c.id) filter ( where c.class_type = 1 ) as small
         from "user" u
                  left join reservation r on u.id = r.user_id
                  left join course c on c.id = r.course_id
         where u.open_id = in_id
         group by u.id
     ) as t
$$;


ALTER FUNCTION public.v1_user_user(in_id text) OWNER TO psycho;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: announcement; Type: TABLE; Schema: public; Owner: psycho
--

CREATE TABLE public.announcement (
    id integer NOT NULL,
    content text,
    title text,
    creation_time bigint NOT NULL,
    updated_time bigint NOT NULL
);


ALTER TABLE public.announcement OWNER TO psycho;

--
-- Name: announcement_id_seq; Type: SEQUENCE; Schema: public; Owner: psycho
--

CREATE SEQUENCE public.announcement_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.announcement_id_seq OWNER TO psycho;

--
-- Name: announcement_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: psycho
--

ALTER SEQUENCE public.announcement_id_seq OWNED BY public.announcement.id;


--
-- Name: card; Type: TABLE; Schema: public; Owner: psycho
--

CREATE TABLE public.card (
    id integer NOT NULL,
    card_type integer,
    count integer,
    description text,
    expired integer,
    price integer,
    title text,
    creation_time bigint NOT NULL,
    updated_time bigint NOT NULL
);


ALTER TABLE public.card OWNER TO psycho;

--
-- Name: card_id_seq; Type: SEQUENCE; Schema: public; Owner: psycho
--

CREATE SEQUENCE public.card_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.card_id_seq OWNER TO psycho;

--
-- Name: card_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: psycho
--

ALTER SEQUENCE public.card_id_seq OWNED BY public.card.id;


--
-- Name: coach; Type: TABLE; Schema: public; Owner: psycho
--

CREATE TABLE public.coach (
    id integer NOT NULL,
    description text,
    introduction text,
    name text,
    open_id text,
    phone_number text,
    thumbnail text,
    coach_type text,
    creation_time bigint NOT NULL,
    updated_time bigint NOT NULL
);


ALTER TABLE public.coach OWNER TO psycho;

--
-- Name: coach_id_seq; Type: SEQUENCE; Schema: public; Owner: psycho
--

CREATE SEQUENCE public.coach_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.coach_id_seq OWNER TO psycho;

--
-- Name: coach_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: psycho
--

ALTER SEQUENCE public.coach_id_seq OWNED BY public.coach.id;


--
-- Name: course; Type: TABLE; Schema: public; Owner: psycho
--

CREATE TABLE public.course (
    id integer NOT NULL,
    class_type integer,
    lesson_id integer,
    date_time integer,
    end_time integer,
    hidden integer,
    peoples integer,
    start_time integer,
    teacher_id integer,
    creation_time bigint NOT NULL,
    updated_time bigint NOT NULL,
    booked_count integer
);


ALTER TABLE public.course OWNER TO psycho;

--
-- Name: course_id_seq; Type: SEQUENCE; Schema: public; Owner: psycho
--

CREATE SEQUENCE public.course_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.course_id_seq OWNER TO psycho;

--
-- Name: course_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: psycho
--

ALTER SEQUENCE public.course_id_seq OWNED BY public.course.id;


--
-- Name: function; Type: TABLE; Schema: public; Owner: psycho
--

CREATE TABLE public.function (
    id integer NOT NULL,
    image text,
    name text,
    page text,
    creation_time bigint NOT NULL,
    updated_time bigint NOT NULL
);


ALTER TABLE public.function OWNER TO psycho;

--
-- Name: function_id_seq; Type: SEQUENCE; Schema: public; Owner: psycho
--

CREATE SEQUENCE public.function_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.function_id_seq OWNER TO psycho;

--
-- Name: function_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: psycho
--

ALTER SEQUENCE public.function_id_seq OWNED BY public.function.id;


--
-- Name: lesson; Type: TABLE; Schema: public; Owner: psycho
--

CREATE TABLE public.lesson (
    id integer NOT NULL,
    description text,
    image text,
    name text,
    creation_time bigint NOT NULL,
    updated_time bigint NOT NULL
);


ALTER TABLE public.lesson OWNER TO psycho;

--
-- Name: lesson_id_seq; Type: SEQUENCE; Schema: public; Owner: psycho
--

CREATE SEQUENCE public.lesson_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lesson_id_seq OWNER TO psycho;

--
-- Name: lesson_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: psycho
--

ALTER SEQUENCE public.lesson_id_seq OWNED BY public.lesson.id;


--
-- Name: list_coaches; Type: VIEW; Schema: public; Owner: psycho
--

CREATE VIEW public.list_coaches AS
 SELECT coach.id,
    coach.introduction,
    coach.name,
    coach.thumbnail,
    coach.coach_type
   FROM public.coach;


ALTER TABLE public.list_coaches OWNER TO psycho;

--
-- Name: market; Type: TABLE; Schema: public; Owner: psycho
--

CREATE TABLE public.market (
    id integer NOT NULL,
    content text,
    title text,
    slogan text,
    creation_time bigint NOT NULL,
    updated_time bigint NOT NULL
);


ALTER TABLE public.market OWNER TO psycho;

--
-- Name: market_id_seq; Type: SEQUENCE; Schema: public; Owner: psycho
--

CREATE SEQUENCE public.market_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.market_id_seq OWNER TO psycho;

--
-- Name: market_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: psycho
--

ALTER SEQUENCE public.market_id_seq OWNED BY public.market.id;


--
-- Name: note; Type: TABLE; Schema: public; Owner: psycho
--

CREATE TABLE public.note (
    id integer NOT NULL,
    title text,
    content text,
    hidden integer DEFAULT 0,
    creation_time bigint NOT NULL,
    updated_time bigint NOT NULL,
    policy integer
);


ALTER TABLE public.note OWNER TO psycho;

--
-- Name: note_id_seq; Type: SEQUENCE; Schema: public; Owner: psycho
--

CREATE SEQUENCE public.note_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.note_id_seq OWNER TO psycho;

--
-- Name: note_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: psycho
--

ALTER SEQUENCE public.note_id_seq OWNED BY public.note.id;


--
-- Name: picture; Type: TABLE; Schema: public; Owner: psycho
--

CREATE TABLE public.picture (
    id integer NOT NULL,
    url text,
    creation_time bigint NOT NULL,
    updated_time bigint NOT NULL
);


ALTER TABLE public.picture OWNER TO psycho;

--
-- Name: picture_id_seq; Type: SEQUENCE; Schema: public; Owner: psycho
--

CREATE SEQUENCE public.picture_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.picture_id_seq OWNER TO psycho;

--
-- Name: picture_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: psycho
--

ALTER SEQUENCE public.picture_id_seq OWNED BY public.picture.id;


--
-- Name: reservation; Type: TABLE; Schema: public; Owner: psycho
--

CREATE TABLE public.reservation (
    id integer NOT NULL,
    course_id integer,
    fulfill integer,
    user_id integer,
    creation_time bigint NOT NULL,
    updated_time bigint NOT NULL,
    vc_id integer
);


ALTER TABLE public.reservation OWNER TO psycho;

--
-- Name: reservation_id_seq; Type: SEQUENCE; Schema: public; Owner: psycho
--

CREATE SEQUENCE public.reservation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.reservation_id_seq OWNER TO psycho;

--
-- Name: reservation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: psycho
--

ALTER SEQUENCE public.reservation_id_seq OWNED BY public.reservation.id;


--
-- Name: settings; Type: TABLE; Schema: public; Owner: psycho
--

CREATE TABLE public.settings (
    id integer NOT NULL,
    close_book integer,
    close_booked integer,
    creation_time bigint NOT NULL,
    updated_time bigint NOT NULL,
    policy integer
);


ALTER TABLE public.settings OWNER TO psycho;

--
-- Name: settings_id_seq; Type: SEQUENCE; Schema: public; Owner: psycho
--

CREATE SEQUENCE public.settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.settings_id_seq OWNER TO psycho;

--
-- Name: settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: psycho
--

ALTER SEQUENCE public.settings_id_seq OWNED BY public.settings.id;


--
-- Name: slideshow; Type: TABLE; Schema: public; Owner: psycho
--

CREATE TABLE public.slideshow (
    id integer NOT NULL,
    image text,
    name text,
    page text,
    creation_time bigint NOT NULL,
    updated_time bigint NOT NULL
);


ALTER TABLE public.slideshow OWNER TO psycho;

--
-- Name: slideshow_id_seq; Type: SEQUENCE; Schema: public; Owner: psycho
--

CREATE SEQUENCE public.slideshow_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.slideshow_id_seq OWNER TO psycho;

--
-- Name: slideshow_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: psycho
--

ALTER SEQUENCE public.slideshow_id_seq OWNED BY public.slideshow.id;


--
-- Name: systeminfo; Type: TABLE; Schema: public; Owner: psycho
--

CREATE TABLE public.systeminfo (
    id integer NOT NULL,
    open_id text,
    sdk_version text,
    brand text,
    model text,
    pixel_ratio text,
    platform text,
    screen_height text,
    screen_width text,
    version text,
    ip text,
    count integer,
    creation_time bigint NOT NULL,
    updated_time bigint NOT NULL
);


ALTER TABLE public.systeminfo OWNER TO psycho;

--
-- Name: systeminfo_id_seq; Type: SEQUENCE; Schema: public; Owner: psycho
--

CREATE SEQUENCE public.systeminfo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.systeminfo_id_seq OWNER TO psycho;

--
-- Name: systeminfo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: psycho
--

ALTER SEQUENCE public.systeminfo_id_seq OWNED BY public.systeminfo.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: psycho
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    address text,
    avatar_url text,
    gender integer,
    name text,
    nick_name text NOT NULL,
    note text,
    open_id text NOT NULL,
    phone text,
    user_type integer,
    creation_time bigint NOT NULL,
    updated_time bigint NOT NULL
);


ALTER TABLE public."user" OWNER TO psycho;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: psycho
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_id_seq OWNER TO psycho;

--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: psycho
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- Name: userinfo; Type: TABLE; Schema: public; Owner: psycho
--

CREATE TABLE public.userinfo (
    id integer NOT NULL,
    username text,
    user_type integer,
    phone_number text,
    password text,
    creation_time bigint NOT NULL,
    updated_time bigint NOT NULL,
    CONSTRAINT userinfo_password_check CHECK ((length(password) > 7)),
    CONSTRAINT userinfo_phone_number_check CHECK ((length(phone_number) > 10))
);


ALTER TABLE public.userinfo OWNER TO psycho;

--
-- Name: userinfo_id_seq; Type: SEQUENCE; Schema: public; Owner: psycho
--

CREATE SEQUENCE public.userinfo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.userinfo_id_seq OWNER TO psycho;

--
-- Name: userinfo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: psycho
--

ALTER SEQUENCE public.userinfo_id_seq OWNED BY public.userinfo.id;


--
-- Name: vip_card; Type: TABLE; Schema: public; Owner: psycho
--

CREATE TABLE public.vip_card (
    id integer NOT NULL,
    card_id integer,
    end_date integer,
    hidden integer,
    times integer,
    start_date integer,
    user_id integer,
    creation_time bigint NOT NULL,
    updated_time bigint NOT NULL,
    slide integer
);


ALTER TABLE public.vip_card OWNER TO psycho;

--
-- Name: vip_card_id_seq; Type: SEQUENCE; Schema: public; Owner: psycho
--

CREATE SEQUENCE public.vip_card_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.vip_card_id_seq OWNER TO psycho;

--
-- Name: vip_card_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: psycho
--

ALTER SEQUENCE public.vip_card_id_seq OWNED BY public.vip_card.id;


--
-- Name: announcement id; Type: DEFAULT; Schema: public; Owner: psycho
--

ALTER TABLE ONLY public.announcement ALTER COLUMN id SET DEFAULT nextval('public.announcement_id_seq'::regclass);


--
-- Name: card id; Type: DEFAULT; Schema: public; Owner: psycho
--

ALTER TABLE ONLY public.card ALTER COLUMN id SET DEFAULT nextval('public.card_id_seq'::regclass);


--
-- Name: coach id; Type: DEFAULT; Schema: public; Owner: psycho
--

ALTER TABLE ONLY public.coach ALTER COLUMN id SET DEFAULT nextval('public.coach_id_seq'::regclass);


--
-- Name: course id; Type: DEFAULT; Schema: public; Owner: psycho
--

ALTER TABLE ONLY public.course ALTER COLUMN id SET DEFAULT nextval('public.course_id_seq'::regclass);


--
-- Name: function id; Type: DEFAULT; Schema: public; Owner: psycho
--

ALTER TABLE ONLY public.function ALTER COLUMN id SET DEFAULT nextval('public.function_id_seq'::regclass);


--
-- Name: lesson id; Type: DEFAULT; Schema: public; Owner: psycho
--

ALTER TABLE ONLY public.lesson ALTER COLUMN id SET DEFAULT nextval('public.lesson_id_seq'::regclass);


--
-- Name: market id; Type: DEFAULT; Schema: public; Owner: psycho
--

ALTER TABLE ONLY public.market ALTER COLUMN id SET DEFAULT nextval('public.market_id_seq'::regclass);


--
-- Name: note id; Type: DEFAULT; Schema: public; Owner: psycho
--

ALTER TABLE ONLY public.note ALTER COLUMN id SET DEFAULT nextval('public.note_id_seq'::regclass);


--
-- Name: picture id; Type: DEFAULT; Schema: public; Owner: psycho
--

ALTER TABLE ONLY public.picture ALTER COLUMN id SET DEFAULT nextval('public.picture_id_seq'::regclass);


--
-- Name: reservation id; Type: DEFAULT; Schema: public; Owner: psycho
--

ALTER TABLE ONLY public.reservation ALTER COLUMN id SET DEFAULT nextval('public.reservation_id_seq'::regclass);


--
-- Name: settings id; Type: DEFAULT; Schema: public; Owner: psycho
--

ALTER TABLE ONLY public.settings ALTER COLUMN id SET DEFAULT nextval('public.settings_id_seq'::regclass);


--
-- Name: slideshow id; Type: DEFAULT; Schema: public; Owner: psycho
--

ALTER TABLE ONLY public.slideshow ALTER COLUMN id SET DEFAULT nextval('public.slideshow_id_seq'::regclass);


--
-- Name: systeminfo id; Type: DEFAULT; Schema: public; Owner: psycho
--

ALTER TABLE ONLY public.systeminfo ALTER COLUMN id SET DEFAULT nextval('public.systeminfo_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: psycho
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Name: userinfo id; Type: DEFAULT; Schema: public; Owner: psycho
--

ALTER TABLE ONLY public.userinfo ALTER COLUMN id SET DEFAULT nextval('public.userinfo_id_seq'::regclass);


--
-- Name: vip_card id; Type: DEFAULT; Schema: public; Owner: psycho
--

ALTER TABLE ONLY public.vip_card ALTER COLUMN id SET DEFAULT nextval('public.vip_card_id_seq'::regclass);


--
-- Name: announcement announcement_pkey; Type: CONSTRAINT; Schema: public; Owner: psycho
--

ALTER TABLE ONLY public.announcement
    ADD CONSTRAINT announcement_pkey PRIMARY KEY (id);


--
-- Name: card card_pkey; Type: CONSTRAINT; Schema: public; Owner: psycho
--

ALTER TABLE ONLY public.card
    ADD CONSTRAINT card_pkey PRIMARY KEY (id);


--
-- Name: coach coach_pkey; Type: CONSTRAINT; Schema: public; Owner: psycho
--

ALTER TABLE ONLY public.coach
    ADD CONSTRAINT coach_pkey PRIMARY KEY (id);


--
-- Name: course course_pkey; Type: CONSTRAINT; Schema: public; Owner: psycho
--

ALTER TABLE ONLY public.course
    ADD CONSTRAINT course_pkey PRIMARY KEY (id);


--
-- Name: function function_pkey; Type: CONSTRAINT; Schema: public; Owner: psycho
--

ALTER TABLE ONLY public.function
    ADD CONSTRAINT function_pkey PRIMARY KEY (id);


--
-- Name: lesson lesson_pkey; Type: CONSTRAINT; Schema: public; Owner: psycho
--

ALTER TABLE ONLY public.lesson
    ADD CONSTRAINT lesson_pkey PRIMARY KEY (id);


--
-- Name: market market_pkey; Type: CONSTRAINT; Schema: public; Owner: psycho
--

ALTER TABLE ONLY public.market
    ADD CONSTRAINT market_pkey PRIMARY KEY (id);


--
-- Name: note note_pkey; Type: CONSTRAINT; Schema: public; Owner: psycho
--

ALTER TABLE ONLY public.note
    ADD CONSTRAINT note_pkey PRIMARY KEY (id);


--
-- Name: picture picture_pkey; Type: CONSTRAINT; Schema: public; Owner: psycho
--

ALTER TABLE ONLY public.picture
    ADD CONSTRAINT picture_pkey PRIMARY KEY (id);


--
-- Name: reservation reservation_pkey; Type: CONSTRAINT; Schema: public; Owner: psycho
--

ALTER TABLE ONLY public.reservation
    ADD CONSTRAINT reservation_pkey PRIMARY KEY (id);


--
-- Name: settings settings_pkey; Type: CONSTRAINT; Schema: public; Owner: psycho
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);


--
-- Name: slideshow slideshow_pkey; Type: CONSTRAINT; Schema: public; Owner: psycho
--

ALTER TABLE ONLY public.slideshow
    ADD CONSTRAINT slideshow_pkey PRIMARY KEY (id);


--
-- Name: systeminfo systeminfo_open_id_key; Type: CONSTRAINT; Schema: public; Owner: psycho
--

ALTER TABLE ONLY public.systeminfo
    ADD CONSTRAINT systeminfo_open_id_key UNIQUE (open_id);


--
-- Name: systeminfo systeminfo_pkey; Type: CONSTRAINT; Schema: public; Owner: psycho
--

ALTER TABLE ONLY public.systeminfo
    ADD CONSTRAINT systeminfo_pkey PRIMARY KEY (id);


--
-- Name: user user_open_id_key; Type: CONSTRAINT; Schema: public; Owner: psycho
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_open_id_key UNIQUE (open_id);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: psycho
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: userinfo userinfo_pkey; Type: CONSTRAINT; Schema: public; Owner: psycho
--

ALTER TABLE ONLY public.userinfo
    ADD CONSTRAINT userinfo_pkey PRIMARY KEY (id);


--
-- Name: vip_card vip_card_pkey; Type: CONSTRAINT; Schema: public; Owner: psycho
--

ALTER TABLE ONLY public.vip_card
    ADD CONSTRAINT vip_card_pkey PRIMARY KEY (id);


--
-- Name: course_class_type_start_time_date_time_uindex; Type: INDEX; Schema: public; Owner: psycho
--

CREATE UNIQUE INDEX course_class_type_start_time_date_time_uindex ON public.course USING btree (class_type, start_time, date_time);


--
-- Name: reservation_course_id_user_id_uindex; Type: INDEX; Schema: public; Owner: psycho
--

CREATE UNIQUE INDEX reservation_course_id_user_id_uindex ON public.reservation USING btree (course_id, user_id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

