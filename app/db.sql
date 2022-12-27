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
-- Name: _query_booked_users(integer); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public._query_booked_users(in_id integer) RETURNS json
    LANGUAGE sql
    AS $$
select json_build_object('lesson', (select row_to_json(t)
                                    from (
                                             select course.start_time,
                                                    course.end_time,
                                                    course.date_time,
                                                    course.peoples,
                                                    course.class_type,
                                                    l.name as lesson_name,
                                                    c.name as teacher_name,
                                                    c.thumbnail,
                                                    hidden
                                             from course
                                                      join coach c on course.teacher_id = c.id
                                                      join lesson l on l.id = course.lesson_id
                                             where course.id = in_id
                                             limit 1
                                         ) as t),
                         'users', (
                             select json_agg(t)
                             from (
                                      select nick_name,name,"user".id,avatar_url
                                      from "user"
                                               join reservation r on "user".id = r.user_id
                                               join course c2 on c2.id = r.course_id
                                      where c2.id = in_id
                                  ) as t
                         )
           );
$$;


ALTER FUNCTION public._query_booked_users(in_id integer) OWNER TO psycho;

--
-- Name: _query_day_lessons(integer, text, integer); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public._query_day_lessons(input_date_time integer, input_open_id text, input_class_type integer) RETURNS TABLE(course_id integer, peoples integer, count bigint, reservation_id integer, start_time integer, end_time integer, date_time integer, lesson_name text, class_type integer, teacher_name text, thumbnail text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY select course.id                                 as course_id,
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
                         course.class_type,
                        c.name                                    as teacher_name,
                        c.thumbnail
                 from course
                          join coach c on course.teacher_id = c.id
                          join lesson l on l.id = course.lesson_id
                 where course.hidden <> 1
                   and course.date_time = input_date_time
                   and course.class_type & input_class_type = course.class_type;
END;
$$;


ALTER FUNCTION public._query_day_lessons(input_date_time integer, input_open_id text, input_class_type integer) OWNER TO psycho;

--
-- Name: _query_lessons(integer, integer, integer); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public._query_lessons(input_start_time integer, input_end_time integer, input_class_type integer) RETURNS json
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


ALTER FUNCTION public._query_lessons(input_start_time integer, input_end_time integer, input_class_type integer) OWNER TO psycho;

--
-- Name: _query_today_lessons(integer, integer, text, integer); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public._query_today_lessons(input_start_time integer, input_end_time integer, input_open_id text, input_class_type integer) RETURNS json
    LANGUAGE sql
    AS $$
select json_agg(t)
from (
         select c.id           as course_id,
                reservation.id as reservation_id,
                c.start_time,
                c.end_time,
                c.date_time,
                l.name         as lesson_name,
                class_type,
                c2.name        as teacher_name,
                c2.thumbnail
         from reservation
                  join "user" u on u.id = reservation.user_id
                  join course c on c.id = reservation.course_id
                  join lesson l on l.id = c.lesson_id
                  join coach c2 on c.teacher_id = c2.id
         where u.open_id = input_open_id
           and c.hidden <> 1
           and c.date_time >= input_start_time
           and c.date_time < input_end_time
           and c.class_type & input_class_type = c.class_type
     ) as t
$$;


ALTER FUNCTION public._query_today_lessons(input_start_time integer, input_end_time integer, input_open_id text, input_class_type integer) OWNER TO psycho;

--
-- Name: _update_user(json); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public._update_user(obj json) RETURNS integer
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
            obj ->> 'address', obj ->> 'avatar_url', (obj ->> 'gender')::integer, obj ->> 'name', obj ->> 'nick_name',
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


ALTER FUNCTION public._update_user(obj json) OWNER TO psycho;

--
-- Name: block_user(integer); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.block_user(in_id integer) RETURNS integer
    LANGUAGE sql
    AS $$
update "user"
set user_type= -1
where id = in_id
returning id
$$;


ALTER FUNCTION public.block_user(in_id integer) OWNER TO psycho;

--
-- Name: check_if_date_card_valid(integer, integer); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.check_if_date_card_valid(in_vip_card_id integer, card_id integer) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
    date_in_seconds    int;
    temp_creation_time int;
    offset_days        int;
    dif                bigint;
BEGIN
    -- Timestamp of the current date in seconds
    date_in_seconds = floor(extract(epoch from date(now()))) - 28800;

    -- Query the time when the user first used the vip card to book a course
    select creation_time
    into temp_creation_time
    from reservation
    where vc_id = in_vip_card_id
    order by creation_time
    limit 1;

    if temp_creation_time is null then
        return 1;
    end if;

    if card_id = 1 then
        offset_days = 7;
    elseif card_id = 2 then
        offset_days = 30;
    elseif card_id = 3 then
        offset_days = 365;
    end if;
    dif = temp_creation_time + (offset_days-1)* 86400;
    if dif >= date_in_seconds then
        return dif;
    end if;

    return 0;
END;
$$;


ALTER FUNCTION public.check_if_date_card_valid(in_vip_card_id integer, card_id integer) OWNER TO psycho;

--
-- Name: check_if_times_card_valid(integer); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.check_if_times_card_valid(in_vip_card_id integer) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_ids           int[];
    temp_before_ids int[];
    temp_after      int;
    temp_before     int;
    dif             int;
BEGIN

    FOR temp_before_ids in
        select array_agg(reservation.id)
        from reservation
                 join course c
                      on c.id = reservation.course_id
             -- If hidden equals 1, the course has been actively terminated by the administrator
        where c.hidden < 1
          and c.date_time + c.end_time <= floor(extract(epoch from date(now())))
        group by c.id
                 -- If there are less than 3 students booking the course, the course will be terminated passively
        having count(reservation.id) > 2
        loop
            v_ids = array_cat(v_ids, temp_before_ids);
        end loop;

    select count(id)
    into temp_before
    from reservation
    where vc_id = in_vip_card_id
      and id = any (v_ids);


    select count(reservation.id)
    into temp_after
    from reservation
             join course c2 on c2.id = reservation.course_id
    where c2.hidden < 1
      and c2.date_time + c2.end_time > floor(extract(epoch from date(now())))
      and vc_id = in_vip_card_id;

    dif = (select times from vip_card where id = in_vip_card_id) - (temp_before + coalesce(temp_after, 0));
     raise notice '=========================== % %',in_vip_card_id,temp_before + coalesce(temp_after, 0);
    if dif > 0 then
        return temp_before + coalesce(temp_after, 0);
    end if;
    return 0;
END;
$$;


ALTER FUNCTION public.check_if_times_card_valid(in_vip_card_id integer) OWNER TO psycho;

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
-- Name: current_date_seconds(); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.current_date_seconds() RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    seconds int;
BEGIN
    seconds = floor(extract(epoch from date(now() at time zone 'CCT'))) - 28800;
    return seconds;
END;
$$;


ALTER FUNCTION public.current_date_seconds() OWNER TO psycho;

--
-- Name: current_seconds(); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.current_seconds() RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    seconds int;
BEGIN
    seconds = floor(extract(epoch from now())) - current_date_seconds();
    seconds = seconds - seconds % 60;
    return seconds;
END;
$$;


ALTER FUNCTION public.current_seconds() OWNER TO psycho;

--
-- Name: date_seconds(); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.date_seconds() RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    seconds int;
BEGIN
    seconds = floor(extract(epoch from date(now() at time zone 'CCT'))) - 28800;
    return seconds;
END;
$$;


ALTER FUNCTION public.date_seconds() OWNER TO psycho;

--
-- Name: delete_announcement(integer, text); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.delete_announcement(in_id integer, in_open_id text) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    result_id integer=0;
    has       integer;
BEGIN
    select count(id)
    from "user"
    where "user".open_id = in_open_id
      and "user".user_type & 4 = 4
    into has;
    if has > 0 then
        delete from announcement where id = in_id
        returning id into result_id;
    end if;
    RETURN result_id;
END;
$$;


ALTER FUNCTION public.delete_announcement(in_id integer, in_open_id text) OWNER TO psycho;

--
-- Name: delete_booked(integer, text); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.delete_booked(input_id integer, input_open_id text) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    result_id integer := -1;
    id_array  integer[];
BEGIN
    select array_agg(reservation.id)
    from reservation
             join "user" u on u.id = reservation.user_id
    where u.open_id = input_open_id
    into id_array;
    if array_position(id_array, input_id) > 0 then
        DELETE
        from reservation
        where id = input_id
        RETURNING id into result_id;
    end if;

    RETURN result_id;
END;
$$;


ALTER FUNCTION public.delete_booked(input_id integer, input_open_id text) OWNER TO psycho;

--
-- Name: delete_lesson(integer, text); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.delete_lesson(in_id integer, in_open_id text) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    result_id integer=0;
    has       integer;
BEGIN
    select count("user".id)
    from "user"
    where "user".open_id = in_open_id
      and "user".user_type & 4 = 4
    into has;
    if has > 0 then
        delete
        from lesson
        where lesson.id = in_id
        returning id into result_id;
    end if;
    RETURN result_id;
END;
$$;


ALTER FUNCTION public.delete_lesson(in_id integer, in_open_id text) OWNER TO psycho;

--
-- Name: delete_picture(integer, text); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.delete_picture(in_id integer, in_open_id text) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    result_id integer=0;
    has       integer;
BEGIN
    select count(id)
    from "user"
    where "user".open_id = in_open_id
      and "user".user_type & 4 = 4
    into has;
    if has > 0 then
        delete from picture where id = in_id
        returning id into result_id;
    end if;
    RETURN result_id;
END;
$$;


ALTER FUNCTION public.delete_picture(in_id integer, in_open_id text) OWNER TO psycho;

--
-- Name: delete_reservation(integer, text); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.delete_reservation(in_id integer, in_open_id text) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    result_id integer=0;
    has       integer;
BEGIN
    select count(id)
    from "user"
    where "user".open_id = in_open_id
      and "user".user_type & 4 = 4
    into has;
    if has > 0 then
        delete from reservation where id = in_id
        returning id into result_id;
    end if;
    RETURN result_id;
END;
$$;


ALTER FUNCTION public.delete_reservation(in_id integer, in_open_id text) OWNER TO psycho;

--
-- Name: delete_user(integer, text); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.delete_user(in_id integer, in_open_id text) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    result_id integer=0;
    has       integer;
BEGIN
    select count(id)
    from "user"
    where "user".open_id = in_open_id
      and "user".user_type & 4 = 4
    into has;
    if has > 0 then
        delete from "user" where id = in_id or open_id = in_open_id
        returning id into result_id;
    end if;
    RETURN result_id;
END;
$$;


ALTER FUNCTION public.delete_user(in_id integer, in_open_id text) OWNER TO psycho;

--
-- Name: first_booked_time(integer); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.first_booked_time(in_user_id integer) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_time bigint;
BEGIN
    select creation_time
    into v_time
    from reservation
    where reservation.
              user_id = in_user_id
    order by creation_time
    limit 1;
    if v_time is null then
        return 0;
    end if;
    return extract(epoch from date(to_timestamp(v_time) at time zone 'CCT'));
END;
$$;


ALTER FUNCTION public.first_booked_time(in_user_id integer) OWNER TO psycho;

--
-- Name: hidden_course(integer, text, integer); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.hidden_course(input_id integer, input_open_id text, input_hidden integer) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    has    integer;
    result integer := 0;
BEGIN
    select count(id)
    from "user"
    where "user".open_id = input_open_id
      and "user".user_type & 4 = 4
    into has;
    if has > 0 then
        update course
        set hidden = input_hidden
        where id = input_id
        returning id into result;
    end if;
    return result;

END;
$$;


ALTER FUNCTION public.hidden_course(input_id integer, input_open_id text, input_hidden integer) OWNER TO psycho;

--
-- Name: insert_announcement(text, integer, text, text, bigint, bigint); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.insert_announcement(in_open_id text, in_id integer, in_content text, in_title text, in_creation_time bigint, in_updated_time bigint) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    result_id integer=0;
    has       integer;
BEGIN
    select count("user".id)
    from "user"
    where "user".open_id = in_open_id
      and "user".user_type & 4 = 4
    into has;
    if has > 0 then

        insert into announcement (id,
                                  content,
                                  title,
                                  creation_time,
                                  updated_time)
        values (coalesce(NULLIF(in_id, 0), coalesce((select max(id) from announcement), 0) + 1),
                in_content,
                in_title,
                coalesce(NULLIF(in_creation_time, 0), (select unix())),
                coalesce(NULLIF(in_updated_time, 0), (select unix())))
        ON CONFLICT (id) DO update
            set id            = coalesce(NULLIF(in_id, 0), announcement.id),
                content       = coalesce(NULLIF(in_content, ''), announcement.content),
                title         = coalesce(NULLIF(in_title, ''), announcement.title),
                creation_time = coalesce(NULLIF(in_creation_time, 0), announcement.creation_time),
                updated_time  = (select unix())
        where announcement.id = in_id
        returning id into result_id;

    end if;
    RETURN result_id;
END;
$$;


ALTER FUNCTION public.insert_announcement(in_open_id text, in_id integer, in_content text, in_title text, in_creation_time bigint, in_updated_time bigint) OWNER TO psycho;

--
-- Name: insert_card(text, integer, integer, integer, text, integer, integer, text, bigint, bigint); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.insert_card(in_open_id text, in_id integer, in_card_type integer, in_count integer, in_description text, in_expired integer, in_price integer, in_title text, in_creation_time bigint, in_updated_time bigint) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    result_id integer=0;
    has       integer;
BEGIN
    select count("user".id)
    from "user"
    where "user".open_id = in_open_id
      and "user".user_type & 4 = 4
    into has;
    if has > 0 then

        insert into card (id,
                          card_type,
                          count,
                          description,
                          expired,
                          price,
                          title,
                          creation_time,
                          updated_time)
        values (coalesce(NULLIF(in_id, 0), (select max(id) from card) + 1),
                in_card_type,
                in_count,
                in_description,
                in_expired,
                in_price,
                in_title,
                coalesce(NULLIF(in_creation_time, 0), (select unix())),
                coalesce(NULLIF(in_updated_time, 0), (select unix())))
        ON CONFLICT (id) DO update
            set id            = coalesce(NULLIF(in_id, 0), card.id),
                card_type     = coalesce(NULLIF(in_card_type, 0), card.card_type),
                count         = coalesce(NULLIF(in_count, 0), card.count),
                description   = coalesce(NULLIF(in_description, ''), card.description),
                expired       = coalesce(NULLIF(in_expired, 0), card.expired),
                price         = coalesce(NULLIF(in_price, 0), card.price),
                title         = coalesce(NULLIF(in_title, ''), card.title),
                creation_time = coalesce(NULLIF(in_creation_time, 0), card.creation_time),
                updated_time  = coalesce(NULLIF(in_updated_time, 0), card.updated_time)
-- lesson_id  = coalesce((select id from lesson where name = '哈他基础'), lesson_id),
-- (select unix())
--                 coalesce(NULLIF(in_creation_time, 0), (select unix())),
--                 coalesce(NULLIF( in_updated_time, 0), (select unix()))

        where card.id = in_id
        returning id into result_id;

    end if;
    RETURN result_id;
END
$$;


ALTER FUNCTION public.insert_card(in_open_id text, in_id integer, in_card_type integer, in_count integer, in_description text, in_expired integer, in_price integer, in_title text, in_creation_time bigint, in_updated_time bigint) OWNER TO psycho;

--
-- Name: insert_coach(text, integer, text, text, text, text, text, text, bigint, bigint); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.insert_coach(in_open_id text, in_id integer, in_description text, in_introduction text, in_name text, in_phone_number text, in_thumbnail text, in_coach_type text, in_creation_time bigint, in_updated_time bigint) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    result_id integer=0;
    has       integer;
BEGIN
    select count("user".id)
    from "user"
    where "user".open_id = in_open_id
      and "user".user_type & 4 = 4
    into has;
    if has > 0 then

        insert into coach (id,
                           description,
                           introduction,
                           name,
                           phone_number,
                           thumbnail,
                           coach_type,
                           creation_time,
                           updated_time)
        values (coalesce(NULLIF(in_id, 0), (select max(id) from coach) + 1),
                in_description,
                in_introduction,
                in_name,
                in_phone_number,
                in_thumbnail,
                in_coach_type,
                coalesce(NULLIF(in_creation_time, 0), (select unix())),
                coalesce(NULLIF(in_updated_time, 0), (select unix())))
        ON CONFLICT (id) DO update
            set id            = coalesce(NULLIF(in_id, 0), coach.id),
                description   = coalesce(NULLIF(in_description, ''), coach.description),
                introduction  = coalesce(NULLIF(in_introduction, ''), coach.introduction),
                name          = coalesce(NULLIF(in_name, ''), coach.name),
                phone_number  = coalesce(NULLIF(in_phone_number, ''), coach.phone_number),
                thumbnail     = coalesce(NULLIF(in_thumbnail, ''), coach.thumbnail),
                coach_type    = coalesce(NULLIF(in_coach_type, ''), coach.coach_type),
                creation_time = coalesce(NULLIF(in_creation_time, 0), coach.creation_time),
                updated_time  = coalesce(NULLIF(in_updated_time, 0), coach.updated_time)
-- lesson_id  = coalesce((select id from lesson where name = '哈他基础'), lesson_id),
-- (select unix())
--                 coalesce(NULLIF(in_creation_time, 0), (select unix())),
--                 coalesce(NULLIF( in_updated_time, 0), (select unix()))

        where coach.id = in_id
        returning id into result_id;

    end if;
    RETURN result_id;
END;
$$;


ALTER FUNCTION public.insert_coach(in_open_id text, in_id integer, in_description text, in_introduction text, in_name text, in_phone_number text, in_thumbnail text, in_coach_type text, in_creation_time bigint, in_updated_time bigint) OWNER TO psycho;

--
-- Name: insert_lesson(text, integer, text, text, text, bigint, bigint); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.insert_lesson(in_open_id text, in_id integer, in_description text, in_image text, in_name text, in_creation_time bigint, in_updated_time bigint) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    result_id integer=0;
    has       integer;
BEGIN
    select count("user".id)
    from "user"
    where "user".open_id = in_open_id
      and "user".user_type & 4 = 4
    into has;
    if has > 0 then

        insert into lesson (id,
                            description,
                            image,
                            name,
                            creation_time,
                            updated_time)
        values (coalesce(NULLIF(in_id, 0), (select max(id) from lesson) + 1),
                in_description,
                in_image,
                in_name,
                coalesce(NULLIF(in_creation_time, 0), (select unix())),
                coalesce(NULLIF(in_updated_time, 0), (select unix())))
        ON CONFLICT (id) DO update
            set id            = coalesce(NULLIF(in_id, 0), lesson.id),
                description   = coalesce(NULLIF(in_description, ''), lesson.description)
                    ,
                image         = coalesce(NULLIF(in_image, ''), lesson.image)
                    ,
                name          = coalesce(NULLIF(in_name, ''), lesson.name)
                    ,
                creation_time = coalesce(NULLIF(in_creation_time, 0), lesson.creation_time)
                    ,
                updated_time  = (select unix())
                -- lesson_id  = coalesce((select id from lesson where name = '哈他基础'), lesson_id),
-- (select unix())
        where lesson.id = in_id
        returning id into result_id;

    end if;
    RETURN result_id;
END;
$$;


ALTER FUNCTION public.insert_lesson(in_open_id text, in_id integer, in_description text, in_image text, in_name text, in_creation_time bigint, in_updated_time bigint) OWNER TO psycho;

--
-- Name: insert_lessons(text, integer, integer, integer, text, integer, integer, text, timestamp without time zone, timestamp without time zone); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.insert_lessons(in_open_id text, in_class_type integer, in_date_time integer, in_end_time integer, in_lesson text, in_peoples integer, in_start_time integer, in_teacher text, in_start timestamp without time zone, in_end timestamp without time zone) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    t   integer;
    has integer;
BEGIN
    select count("user".id)
    from "user"
    where "user".open_id = in_open_id
      and "user".user_type & 4 = 4
    into has;
    if has > 0 then
        for t in
            SELECT extract(epoch from days AT TIME ZONE 'CCT')
            FROM generate_series(in_start, in_end, '1 day' :: interval) AS days
            where EXTRACT(dow FROM days) = in_date_time
            loop
                insert into course (class_type, lesson_id, date_time, end_time, hidden, peoples, start_time, teacher_id,
                                    creation_time, updated_time)
                values (in_class_type,
                        (select id from lesson where name = in_lesson),
                        t,
                        in_end_time,
                        0,
                        in_peoples,
                        in_start_time,
                        (select id from coach where name = in_teacher),
                        (select unix()),
                        (select unix()));
            end loop;
    end if;
END;
$$;


ALTER FUNCTION public.insert_lessons(in_open_id text, in_class_type integer, in_date_time integer, in_end_time integer, in_lesson text, in_peoples integer, in_start_time integer, in_teacher text, in_start timestamp without time zone, in_end timestamp without time zone) OWNER TO psycho;

--
-- Name: insert_market(text, integer, text, text, text, bigint, bigint); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.insert_market(in_open_id text, in_id integer, in_content text, in_title text, in_slogan text, in_creation_time bigint, in_updated_time bigint) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    result_id integer=0;
    has       integer;
BEGIN
    select count("user".id)
    from "user"
    where "user".open_id = in_open_id
      and "user".user_type & 4 = 4
    into has;
    if has > 0 then

        insert into market (id,
                            content,
                            title,
                            slogan,
                            creation_time,
                            updated_time)
        values (coalesce(NULLIF(in_id, 0), coalesce((select max(id) from market), 0) + 1),
                in_content,
                in_title,
                in_slogan,
                coalesce(NULLIF(in_creation_time, 0), (select unix())),
                coalesce(NULLIF(in_updated_time, 0), (select unix())))
        ON CONFLICT (id) DO update
            set id            = coalesce(NULLIF(in_id, 0), market.id),
                content       = coalesce(NULLIF(in_content, ''), market.content),
                title         = coalesce(NULLIF(in_title, ''), market.title),
                slogan        = coalesce(NULLIF(in_slogan, ''), market.slogan),
                creation_time = coalesce(NULLIF(in_creation_time, 0), market.creation_time),
                updated_time  = (select unix())
        where market.id = in_id
        returning id into result_id;

    end if;
    RETURN result_id;
END;
$$;


ALTER FUNCTION public.insert_market(in_open_id text, in_id integer, in_content text, in_title text, in_slogan text, in_creation_time bigint, in_updated_time bigint) OWNER TO psycho;

--
-- Name: insert_picture(text, integer, text, bigint, bigint); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.insert_picture(in_open_id text, in_id integer, in_url text, in_creation_time bigint, in_updated_time bigint) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    result_id integer=0;
    has       integer;
BEGIN
    select count("user".id)
    from "user"
    where "user".open_id = in_open_id
      and "user".user_type & 4 = 4
    into has;
    if has > 0 then

        insert into picture (id,
                             url,
                             creation_time,
                             updated_time)
        values (coalesce(NULLIF(in_id, 0), coalesce((select max(id) from picture), 0) + 1),
                in_url,
                coalesce(NULLIF(in_creation_time, 0), (select unix())),
                coalesce(NULLIF(in_updated_time, 0), (select unix())))
        ON CONFLICT (id) DO update
            set id            = coalesce(NULLIF(in_id, 0), picture.id),
                url           = coalesce(NULLIF(in_url, ''), picture.url),
                creation_time = coalesce(NULLIF(in_creation_time, 0), picture.creation_time),
                updated_time  = (select unix())
-- lesson_id  = coalesce((select id from lesson where name = '哈他基础'), lesson_id),
-- (select unix())
--                 coalesce(NULLIF(in_creation_time, 0), (select unix())),
--                 coalesce(NULLIF( in_updated_time, 0), (select unix()))

        where picture.id = in_id
        returning id into result_id;

    end if;
    RETURN result_id;
END;
$$;


ALTER FUNCTION public.insert_picture(in_open_id text, in_id integer, in_url text, in_creation_time bigint, in_updated_time bigint) OWNER TO psycho;

--
-- Name: insert_reservation(integer, text); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.insert_reservation(input_course_id integer, input_open_id text) RETURNS integer
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


-- 当前的时间（以秒为单位，不包括点钟、分钟、秒钟的时间戳）
    date_time_seconds int;

-- 会员卡标识
    v_vc_id           int;

-- 开始上课的时间
    v_start_time      int;

-- 学员的类型
    v_user_type       int ;

-- 学员的标识
    v_user_id         int;

-- 学员已购买会员卡的记录
    temprow           record;
    query_result      int;
BEGIN

    /*
    检查微信标识格式是否正确
    Check whether the OpenID is legal
    */

    -- 微信标识必须为长度28的字符串
    if input_open_id is null or length(input_open_id) != 28 then
        return -103;
    end if;

    /*
    检查学员是否被屏蔽
    Check whether the user is blocked
    */
    -- 通过微信标识从学员表中查找用户标识和类型
    select id, user_type into v_user_id,v_user_type from "user" where open_id = input_open_id;

    -- 类型-1：已屏蔽的学员
    if v_user_type = -1 then
        return -100;
    end if;

    /*
    检查课程是否已满额
    Check whether the lesson is fully booked
    */

    PERFORM update_course_booked_count();

    -- 通过课程标识从课程和预约表中，查找已预约该课程的学员人数，课程预设的人数，课程的日期，课程开始的时间
    select booked_count, course.peoples, course.date_time, start_time
    into booked,peoples,date_time,v_start_time
    from course
    where id = input_course_id
    limit 1;

    if booked is null then
        select count(*) into booked from reservation where course_id = input_course_id;
    end if;

    raise notice 'Query results for the current course: input_course_id = %, booked = %, peoples = %, date_time = %, v_start_time = %',input_course_id,booked,peoples,date_time,v_start_time;

    if booked >= peoples then
        return -101;
    end if;

    /*
    检查课程是否已过期
    Check if the course has expired
    */

    -- 时间戳减去时间戳取余一天的秒钟总数(86400)，再减去中国东海岸时区（8小时的秒中数）得到仅包含日期的时间戳
    date_time_seconds = date_seconds();
    raise notice 'Current date timestamp and course start date timestamp: date_time_seconds = %, date_time = %',date_time_seconds,date_time;
    -- 如果当前日期大于课程日期

    if date_time_seconds > date_time then
        return -102;
        -- 如果当前日期等于课程日期，确定现在的时间是否大于开课时间
    elseif date_time_seconds = date_time and seconds() >= v_start_time then
        return -104;
    end if;

    /*
    查询用户购买的会员卡，获取第一张可用会员卡的标识
    周卡、月卡、年卡检查是否已过期
    次卡检查是否已过期，以及是否有足够的次数
    */

    for temprow in
        -- 查找用户购买的所有会员卡，并以降序排序
        select *
        from vip_card
        where user_id = v_user_id
          and hidden < 1
        order by creation_time desc
        loop

            if temprow.card_id = 4 then --次卡
                select * into query_result from valid_times_card(temprow.id);
                if query_result > 0 then
                    v_vc_id = temprow.id;
                    exit;
                end if;
            elseif temprow.card_id = 1 or temprow.card_id = 2 or temprow.card_id = 3 then -- 周卡
                if temprow.end_date >= date_time then
                    v_vc_id = temprow.id;
                    exit;
                end if;
            end if;

        end loop;
    if v_vc_id is null then
        -- return -105;
    end if;
    raise notice '>>>>>>>>>>>>>>>>>>>>>>>>>>>------------------%',v_vc_id;
    INSERT INTO reservation
        (course_id, fulfill, user_id, creation_time, updated_time, vc_id)
    VALUES (input_course_id,
            0,
            (select id
             from "user"
             where open_id = input_open_id), (select unix()),
            (select unix()),
            v_vc_id)
    RETURNING id into result_id;
    RETURN result_id;
END;
$$;


ALTER FUNCTION public.insert_reservation(input_course_id integer, input_open_id text) OWNER TO psycho;

--
-- Name: insert_settings(integer, integer); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.insert_settings(input_close_book integer, input_close_booked integer) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    result_id integer;
BEGIN
    INSERT INTO settings (id, close_book, close_booked, creation_time, updated_time)
    values (1, input_close_book,
            input_close_booked,
            (select unix()),
            (select unix()))
    ON CONFLICT (id) DO UPDATE
        set close_book  = coalesce(NULLIF(input_close_book, 0), settings.close_book),
            close_booked=coalesce(NULLIF(input_close_booked, 0), settings.close_booked),
            updated_time=(select unix())
    RETURNING id into result_id;
    RETURN result_id;
END;
$$;


ALTER FUNCTION public.insert_settings(input_close_book integer, input_close_booked integer) OWNER TO psycho;

--
-- Name: insert_user(text, integer, text, text, integer, text, text, text, text, text, integer, bigint, bigint); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.insert_user(in_open_id_m text, in_id integer, in_address text, in_avatar_url text, in_gender integer, in_name text, in_nick_name text, in_note text, in_open_id text, in_phone text, in_user_type integer, in_creation_time bigint, in_updated_time bigint) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    result_id integer=0;
    has       integer;
BEGIN
    select count("user".id)
    from "user"
    where "user".open_id = in_open_id_m
      and "user".user_type & 4 = 4
    into has;
    if has > 0 then
        raise notice 'Permission verification passed：%',has;
        insert into "user" (id,
                            address,
                            avatar_url,
                            gender,
                            name,
                            nick_name,
                            note,
                            open_id,
                            phone,
                            user_type,
                            creation_time,
                            updated_time)
        values (coalesce(NULLIF(in_id, 0), coalesce((select max(id) from "user"), 0) + 1),
                in_address,
                in_avatar_url,
                in_gender,
                in_name,
                in_nick_name,
                in_note,
                in_open_id,
                in_phone,
                in_user_type,
                coalesce(NULLIF(in_creation_time, 0), (select unix())),
                coalesce(NULLIF(in_updated_time, 0), (select unix())))
        ON CONFLICT (id) DO update
            set id            = coalesce(NULLIF(in_id, 0), "user".id),
                address       = coalesce(NULLIF(in_address, ''), "user".address),
                avatar_url    = coalesce(NULLIF(in_avatar_url, ''), "user".avatar_url),
                gender        = coalesce(NULLIF(in_gender, 0), "user".gender),
                name          = coalesce(NULLIF(in_name, ''), "user".name),
                nick_name     = coalesce(NULLIF(in_nick_name, ''), "user".nick_name),
                note          = coalesce(NULLIF(in_note, ''), "user".note),
                open_id       = coalesce(NULLIF(in_open_id, ''), "user".open_id),
                phone         = coalesce(NULLIF(in_phone, ''), "user".phone),
                user_type     = coalesce(NULLIF(in_user_type, 0), "user".user_type),
                creation_time = coalesce(NULLIF(in_creation_time, 0), "user".creation_time),
                updated_time  = (select unix())
        where "user".id = in_id
        returning "user".id into result_id;
    elseif length(in_open_id) = 28 then
        insert into "user" (id,
                            avatar_url,
                            nick_name,
                            open_id,
                            creation_time,
                            updated_time)
        values (coalesce(NULLIF(in_id, 0), coalesce((select max(id) from "user"), 0) + 1),
                in_avatar_url,
                in_nick_name,
                in_open_id,
                coalesce(NULLIF(in_creation_time, 0), (select unix())),
                coalesce(NULLIF(in_updated_time, 0), (select unix())))
        returning id into result_id;
    end if;
    RETURN result_id;
END;
$$;


ALTER FUNCTION public.insert_user(in_open_id_m text, in_id integer, in_address text, in_avatar_url text, in_gender integer, in_name text, in_nick_name text, in_note text, in_open_id text, in_phone text, in_user_type integer, in_creation_time bigint, in_updated_time bigint) OWNER TO psycho;

--
-- Name: insert_vip_card(text, integer, integer, integer, integer, integer, integer, integer, bigint, bigint); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.insert_vip_card(in_open_id text, in_id integer, in_card_id integer, in_end_date integer, in_hidden integer, in_times integer, in_start_date integer, in_user_id integer, in_creation_time bigint, in_updated_time bigint) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    result_id integer=0;
    has       integer;
BEGIN
    select count("user".id)
    from "user"
    where "user".open_id = in_open_id
      and "user".user_type & 4 = 4
    into has;
    if has > 0 then

        insert into vip_card (id,
                              card_id,
                              end_date,
                              hidden,
                              times,
                              start_date,
                              user_id,
                              creation_time,
                              updated_time)
        values (coalesce(NULLIF(in_id, 0), coalesce((select max(id) from vip_card), 0) + 1),
                in_card_id,
                in_end_date,
                in_hidden,
                in_times,
                in_start_date,
                in_user_id,
                coalesce(NULLIF(in_creation_time, 0), (select unix())),
                coalesce(NULLIF(in_updated_time, 0), (select unix())))
        ON CONFLICT (id) DO update
            set id            = coalesce(NULLIF(in_id, 0), vip_card.id),
                card_id       = coalesce(NULLIF(in_card_id, 0), vip_card.card_id),
                end_date      = coalesce(NULLIF(in_end_date, 0), vip_card.end_date),
                hidden        = coalesce(NULLIF(in_hidden, 0), vip_card.hidden),
                times         = coalesce(NULLIF(in_times, 0), vip_card.times),
                start_date    = coalesce(NULLIF(in_start_date, 0), vip_card.start_date),
                user_id       = coalesce(NULLIF(in_user_id, 0), vip_card.user_id),
                creation_time = coalesce(NULLIF(in_creation_time, 0), vip_card.creation_time),
                updated_time  = (select unix())
                -- lesson_id  = coalesce((select id from lesson where name = '哈他基础'), lesson_id),
-- (select unix())
--                 coalesce(NULLIF(in_creation_time, 0), (select unix())),
--                 coalesce(NULLIF( in_updated_time, 0), (select unix()))

        where vip_card.id = in_id
        returning id into result_id;

    end if;
    RETURN result_id;
END;
$$;


ALTER FUNCTION public.insert_vip_card(in_open_id text, in_id integer, in_card_id integer, in_end_date integer, in_hidden integer, in_times integer, in_start_date integer, in_user_id integer, in_creation_time bigint, in_updated_time bigint) OWNER TO psycho;

--
-- Name: is_admin(text); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.is_admin(in_id text) RETURNS integer
    LANGUAGE sql
    AS $$
select user_type
from "user"
where open_id = in_id
limit 1
$$;


ALTER FUNCTION public.is_admin(in_id text) OWNER TO psycho;

--
-- Name: numbers_of_booked(text); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.numbers_of_booked(in_open_id text) RETURNS TABLE(class_type integer, count bigint)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY select c.class_type,
                        count(reservation.id) as count
                 from reservation
                          left join course c on c.id = reservation.course_id
                          join "user" u on u.id = reservation.user_id
                 where u.open_id = in_open_id
                 group by c.class_type;
END ;
$$;


ALTER FUNCTION public.numbers_of_booked(in_open_id text) OWNER TO psycho;

--
-- Name: query_admin_user(integer, text); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.query_admin_user(input_id integer, in_open_id text) RETURNS TABLE(address text, avatar_url text, name text, nick_name text, note text, open_id text, phone text, user_type integer)
    LANGUAGE plpgsql
    AS $$
DECLARE
    has integer;
BEGIN
    select count("user".id)
    from "user"
    where "user".open_id = in_open_id
      and "user".user_type & 4 = 4
    into has;
    if has > 0 then
        RETURN QUERY select
                            "user".address,
                            "user".avatar_url,
                            "user".name,
                            "user".nick_name,
                            "user".note,
                            "user".open_id,
                            "user".phone,
                            "user".user_type
                     from "user"
                     where "user".id = input_id
                     limit 1;
    end if;
END
$$;


ALTER FUNCTION public.query_admin_user(input_id integer, in_open_id text) OWNER TO psycho;

--
-- Name: query_admin_vip_card(integer, text); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.query_admin_vip_card(input_id integer, in_open_id text) RETURNS TABLE(card_id integer, end_date integer, hidden integer, times integer, start_date integer, slide integer)
    LANGUAGE plpgsql
    AS $$
DECLARE
    has integer;
BEGIN
    select count("user".id)
    from "user"
    where "user".open_id = in_open_id
      and "user".user_type & 4 = 4
    into has;
    if has > 0 then
        RETURN QUERY select vip_card.card_id,
                            vip_card.end_date,
                            vip_card.hidden,
                            vip_card.times,
                            vip_card.start_date,
                            vip_card.slide
                     from vip_card
                     where vip_card.id = input_id
                     limit 1;
    end if;
END;
$$;


ALTER FUNCTION public.query_admin_vip_card(input_id integer, in_open_id text) OWNER TO psycho;

--
-- Name: query_all_cards(text); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.query_all_cards(in_open_id text) RETURNS TABLE(id integer, card_type integer, count integer, description text, expired integer, price integer, title text, creation_time bigint, updated_time bigint)
    LANGUAGE plpgsql
    AS $$
DECLARE
    has integer;
BEGIN
    select count("user".id)
    from "user"
    where "user".open_id = in_open_id
      and "user".user_type & 4 = 4
    into has;
    if has > 0 then
        RETURN QUERY select card.id,
                            card.card_type,
                            card.count,
                            card.description,
                            card.expired,
                            card.price,
                            card.title,
                            card.creation_time,
                            card.updated_time
                     from card;
    end if;
END;
$$;


ALTER FUNCTION public.query_all_cards(in_open_id text) OWNER TO psycho;

--
-- Name: query_all_courses(text); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.query_all_courses(in_open_id text) RETURNS TABLE(id integer, class_type integer, lesson_id integer, date_time integer, end_time integer, hidden integer, peoples integer, start_time integer, teacher_id integer, creation_time bigint, updated_time bigint)
    LANGUAGE plpgsql
    AS $$
DECLARE
    has integer;
BEGIN
    select count("user".id)
    from "user"
    where "user".open_id = in_open_id
      and "user".user_type & 4 = 4
    into has;
    if has > 0 then
        RETURN QUERY select course.id,
                            course.class_type,
                            course.lesson_id,
                            course.date_time,
                            course.end_time,
                            course.hidden,
                            course.peoples,
                            course.start_time,
                            course.teacher_id,
                            course.creation_time,
                            course.updated_time
                     from course;

    end if;
END;
$$;


ALTER FUNCTION public.query_all_courses(in_open_id text) OWNER TO psycho;

--
-- Name: query_announcement(integer); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.query_announcement(in_id integer) RETURNS json
    LANGUAGE sql
    AS $$
select jsonb_build_object('id', id,
                          'content', content,
                          'title', title,
                          'creationTime', creation_time,
                          'updatedTime', updated_time
           )
from announcement
where id = in_id
limit 1;
$$;


ALTER FUNCTION public.query_announcement(in_id integer) OWNER TO psycho;

--
-- Name: query_announcement_content(integer); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.query_announcement_content(input_id integer) RETURNS TABLE(title text, content text)
    LANGUAGE plpgsql
    AS $$
BEGIN

    RETURN QUERY select announcement.title,
                        announcement.content
                 from announcement
                 where announcement.id = input_id
                 limit 1;
END;
$$;


ALTER FUNCTION public.query_announcement_content(input_id integer) OWNER TO psycho;

--
-- Name: query_announcements(); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.query_announcements() RETURNS json
    LANGUAGE sql
    AS $$
select json_agg(jsonb_build_object('id', id,
                                   'title', title,
                                   'updatedTime', updated_time
    ))
from announcement
$$;


ALTER FUNCTION public.query_announcements() OWNER TO psycho;

--
-- Name: query_booked(integer, integer, text, integer); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.query_booked(input_start_time integer, input_end_time integer, input_open_id text, input_class_type integer) RETURNS TABLE(course_id integer, reservation_id integer, start_time integer, end_time integer, date_time integer, lesson_name text, teacher_name text, thumbnail text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY select c.id           as course_id,
                        reservation.id as reservation_id,
                        c.start_time,
                        c.end_time,
                        c.date_time,
                        l.name         as lesson_name,
                        c2.name        as teacher_name,
                        c2.thumbnail
                 from reservation
                          join "user" u on u.id = reservation.user_id
                          join course c on c.id = reservation.course_id
                          join lesson l on l.id = c.lesson_id
                          join coach c2 on c.teacher_id = c2.id
                 where u.open_id = input_open_id
                   and c.hidden <> 1
                   and c.date_time >= input_start_time
                   and c.date_time < input_end_time
                   and c.class_type & input_class_type = c.class_type;

END;
$$;


ALTER FUNCTION public.query_booked(input_start_time integer, input_end_time integer, input_open_id text, input_class_type integer) OWNER TO psycho;

--
-- Name: query_cards(); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.query_cards() RETURNS json
    LANGUAGE sql
    AS $$
select json_agg(jsonb_build_object('id' , id,
'cardType' , card_type,
'count' , count,
'description' , description,
'expired' , expired,
'price' , price,
'title' , title,
'creationTime' , creation_time,
'updatedTime' , updated_time
    ))
from card;
$$;


ALTER FUNCTION public.query_cards() OWNER TO psycho;

--
-- Name: query_cards(text); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.query_cards(in_open_id text) RETURNS TABLE(id integer, card_type integer, count integer, title text, expired integer)
    LANGUAGE plpgsql
    AS $$
DECLARE
    has integer;
BEGIN
    select count("user".id)
    from "user"
    where "user".open_id = in_open_id
      and "user".user_type & 4 = 4
    into has;
    if has > 0 then
        RETURN QUERY select card.id,
                            card.card_type,
                            card.count,
                            card.title,
                            card.expired
                     from card
                     group by card.id;
    else
        RETURN QUERY select card.id,
                            card.card_type,
                            card.count,
                            card.title,
                            card.expired,
                            0::bigint
                     from card;
    end if;
END;
$$;


ALTER FUNCTION public.query_cards(in_open_id text) OWNER TO psycho;

--
-- Name: query_coach(integer); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.query_coach(in_id integer) RETURNS json
    LANGUAGE sql
    AS $$
select row_to_json(t)
from (
         select *
         from coach
         where id = in_id
         limit 1
     ) as t
$$;


ALTER FUNCTION public.query_coach(in_id integer) OWNER TO psycho;

--
-- Name: query_coach_description(integer); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.query_coach_description(input_id integer) RETURNS TABLE(name text, description text, creation_time bigint, updated_time bigint)
    LANGUAGE plpgsql
    AS $$
BEGIN

    RETURN QUERY select coach.name,
                        coach.description,
                        coach.creation_time,
                        coach.updated_time
                 from coach
                 where coach.id = input_id
                 limit 1;
END;
$$;


ALTER FUNCTION public.query_coach_description(input_id integer) OWNER TO psycho;

--
-- Name: query_coach_names(text); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.query_coach_names(input_open_id text) RETURNS TABLE(name text)
    LANGUAGE plpgsql
    AS $$
DECLARE
    has integer;
BEGIN
    select count(id)
    from "user"
    where "user".open_id = input_open_id
      and "user".user_type & 4 = 4
    into has;
    if has > 0 then
        RETURN QUERY select coach.name
                     from coach;
    else
        return ;
    end if;

END;
$$;


ALTER FUNCTION public.query_coach_names(input_open_id text) OWNER TO psycho;

--
-- Name: query_coachs(text); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.query_coachs(in_open_id text) RETURNS TABLE(id integer, name text, thumbnail text, count bigint, introduction text)
    LANGUAGE plpgsql
    AS $$
DECLARE
    has integer;
BEGIN
    select count("user".id)
    from "user"
    where "user".open_id = in_open_id
      and "user".user_type & 4 = 4
    into has;
    if has > 0 then
        RETURN QUERY select coach.id,
                            coach.name,
                            coach.thumbnail,
                            count(r.id),
                            coach.introduction
                     from coach
                              left join course c on coach.id = c.teacher_id
                              left join reservation r on c.id = r.course_id
                     group by coach.id;
    else
        RETURN QUERY select coach.id,
                            coach.name,
                            coach.thumbnail,
                            0::bigint,
                            coach.introduction
                     from coach;
    end if;
END;
$$;


ALTER FUNCTION public.query_coachs(in_open_id text) OWNER TO psycho;

--
-- Name: query_course(integer); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.query_course(input_id integer) RETURNS TABLE(class_type integer, lesson_name text, date_time integer, end_time integer, hidden integer, peoples integer, start_time integer, teacher_name text, thumbnail text)
    LANGUAGE plpgsql
    AS $$
BEGIN

    RETURN QUERY select course.class_type,
                        l.name,
                        course.date_time,
                        course.end_time,
                        course.hidden,
                        course.peoples,
                        course.start_time,
                        c.name,
                        c.thumbnail
                 from course
                 left join lesson l on course.lesson_id = l.id
                 left join coach c on course.teacher_id = c.id
                 where course.id = input_id
                 limit 1;
END;
$$;


ALTER FUNCTION public.query_course(input_id integer) OWNER TO psycho;

--
-- Name: query_day_lessons(integer, text, integer); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.query_day_lessons(input_date_time integer, input_open_id text, input_class_type integer) RETURNS TABLE(course_id integer, peoples integer, count bigint, reservation_id integer, start_time integer, end_time integer, date_time integer, lesson_name text, teacher_name text, thumbnail text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY select course.id                                 as course_id,
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
                   and course.date_time = input_date_time
                   and course.class_type & input_class_type = course.class_type;
END;
$$;


ALTER FUNCTION public.query_day_lessons(input_date_time integer, input_open_id text, input_class_type integer) OWNER TO psycho;

--
-- Name: query_functions(); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.query_functions() RETURNS json
    LANGUAGE sql
    AS $$
select json_agg(jsonb_build_object('id', id,
                                   'image', image,
                                   'name', name
    ))
from (
         select *
         from function
         order by id
     ) t
$$;


ALTER FUNCTION public.query_functions() OWNER TO psycho;

--
-- Name: query_last_booked(); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.query_last_booked() RETURNS json
    LANGUAGE sql
    AS $$
SELECT json_agg(jsonb_build_object('id', id,
                                   'nickName', nick_name, 'avatarUrl', avatar_url)
           )
from (select reservation.id as id, u.nick_name as nick_name, u.avatar_url as avatar_url
      from reservation
               join "user" u on u.id = reservation.user_id
      where reservation.id in (select max(reservation.id) from reservation group by reservation.user_id)
      order by reservation.creation_time desc
      limit 10
     ) t
$$;


ALTER FUNCTION public.query_last_booked() OWNER TO psycho;

--
-- Name: query_last_vip_card(integer); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.query_last_vip_card(in_user_id integer) RETURNS record
    LANGUAGE plpgsql
    AS $$
declare
    v_times           int;
    date_time_seconds int;
    v_vc_id           int;
    temprow           record;
    v_card_id         int;
    dif               int;
BEGIN
    date_time_seconds = floor(extract(epoch from date(now()))) - 28800;
    raise notice '---------------%',date_time_seconds;
    for temprow in
        -- 查找用户购买的所有会员卡，并以降序排序
        select *
        from vip_card
        where user_id = in_user_id
          and hidden < 1
        order by creation_time desc
        loop
            raise notice 'temprow: id = %, card_id = %',temprow.id,temprow.card_id;

            if temprow.card_id = 4 then --次卡
            /*
            查找次卡的约课次数
            */
                select * into dif from check_if_times_card_valid(temprow.id);
                if dif > 0 then
                    v_vc_id = temprow.id;
                    v_card_id = temprow.card_id;
                    v_times = temprow.times - dif;
                    exit;
                end if;
            elseif temprow.card_id = 1 or temprow.card_id = 2 or temprow.card_id = 3 then -- 周卡
                select * into dif from check_if_date_card_valid(temprow.id, temprow.card_id);
                if dif > 0 then
                    v_vc_id = temprow.id;
                    v_card_id = temprow.card_id;
                    v_times = dif;
                    if dif = 1 and (select count(*)
                                    from reservation
                                    where user_id = in_user_id
                                      and vc_id is not null) = 0 then
                        select creation_time
                        into v_times
                        from reservation
                        where user_id = in_user_id
                        order by creation_time
                        limit 1;
                    end if;
                    exit;
                end if;
            end if;


        end loop;
    return (v_vc_id, v_card_id, v_times);
END
$$;


ALTER FUNCTION public.query_last_vip_card(in_user_id integer) OWNER TO psycho;

--
-- Name: query_lasted_market(); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.query_lasted_market() RETURNS TABLE(id integer, slogan text)
    LANGUAGE plpgsql
    AS $$
BEGIN

    RETURN QUERY select market.id,
                        market.slogan
                 from market
                 order by market.updated_time
                 limit 1;
END;
$$;


ALTER FUNCTION public.query_lasted_market() OWNER TO psycho;

--
-- Name: query_lesson(integer, text); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.query_lesson(input_id integer, in_open_id text) RETURNS TABLE(description text, image text, name text, creation_time bigint, updated_time bigint)
    LANGUAGE plpgsql
    AS $$
DECLARE
    has integer;
BEGIN
    select count("user".id)
    from "user"
    where "user".open_id = in_open_id
      and "user".user_type & 4 = 4
    into has;
    if has > 0 then
        RETURN QUERY select
                            lesson.description,
                            lesson.image,
                            lesson.name,
                            lesson.creation_time,
                            lesson.updated_time
                     from lesson
                     where lesson.id = input_id
                     limit 1;
    end if;
END;
$$;


ALTER FUNCTION public.query_lesson(input_id integer, in_open_id text) OWNER TO psycho;

--
-- Name: query_lessons(text); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.query_lessons(input_open_id text) RETURNS TABLE(id integer, name text)
    LANGUAGE plpgsql
    AS $$
DECLARE
    has integer;
BEGIN
    select count("user".id)
    from "user"
    where "user".open_id = input_open_id
      and "user".user_type & 4 = 4
    into has;
    if has > 0 then
        RETURN QUERY select lesson.id,
                            lesson.name
                     from lesson
                     ORDER BY lesson.updated_time DESC;
    else
        return ;
    end if;

END;
$$;


ALTER FUNCTION public.query_lessons(input_open_id text) OWNER TO psycho;

--
-- Name: query_lessons(integer, integer, integer); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.query_lessons(input_start_time integer, input_end_time integer, input_class_type integer) RETURNS TABLE(course_id integer, peoples integer, count bigint, start_time integer, end_time integer, date_time integer, lesson_name text, teacher_name text, thumbnail text, hidden integer, class_type integer)
    LANGUAGE plpgsql
    AS $$
BEGIN

    RETURN QUERY select course.id                                 as course_id,
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
                   and course.class_type & input_class_type = course.class_type;

END;
$$;


ALTER FUNCTION public.query_lessons(input_start_time integer, input_end_time integer, input_class_type integer) OWNER TO psycho;

--
-- Name: query_market(); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.query_market() RETURNS json
    LANGUAGE sql
    AS $$
select json_agg(jsonb_build_object('id', id,
                                   'content', content,
                                   'title', title,
                                   'slogan', slogan,
                                   'creationTime', creation_time,
                                   'updatedTime', updated_time
    ))
from market;
$$;


ALTER FUNCTION public.query_market() OWNER TO psycho;

--
-- Name: query_market(integer); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.query_market(in_id integer) RETURNS json
    LANGUAGE sql
    AS $$
select jsonb_build_object('id', id,
                          'content', content,
                          'title', title,
                          'slogan', slogan,
                          'creationTime', creation_time,
                          'updatedTime', updated_time
           )
from market
where id = in_id
limit 1;
$$;


ALTER FUNCTION public.query_market(in_id integer) OWNER TO psycho;

--
-- Name: query_market_slogan(); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.query_market_slogan() RETURNS json
    LANGUAGE sql
    AS $$
select jsonb_build_object('id', id,
                          'slogan', slogan
           )
from market
order by id desc
limit 1;
$$;


ALTER FUNCTION public.query_market_slogan() OWNER TO psycho;

--
-- Name: query_pictures(); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.query_pictures() RETURNS TABLE(id integer, url text, updated_time bigint)
    LANGUAGE plpgsql
    AS $$
BEGIN

    RETURN QUERY select picture.id,
                        picture.url,
                        picture.updated_time
                 from picture
                 group by picture.id;

END;
$$;


ALTER FUNCTION public.query_pictures() OWNER TO psycho;

--
-- Name: query_reservations(integer, text); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.query_reservations(in_user_id integer, in_open_id text) RETURNS TABLE(reservation_id integer, course_id integer, lesson_name text, coach_name text, image text, start_time integer, end_time integer, date_time integer, hidden integer, peoples bigint, class_type integer, creation_time bigint, vc_id integer)
    LANGUAGE plpgsql
    AS $$
DECLARE
    has integer;
BEGIN
    select count("user".id)
    from "user"
    where "user".open_id = in_open_id
      and "user".user_type & 4 = 4
    into has;
    if has > 0 then
        RETURN QUERY select reservation.id,
                            c.id,
                            l.name,
                            c2.name,
                            c2.thumbnail,
                            c.start_time,
                            c.end_time,
                            c.date_time,
                            c.hidden,
                            (select count(*) from reservation where reservation.course_id = c.id),
                            c.class_type,
                            reservation.creation_time,
                            reservation.vc_id
                     from reservation
                              join course c on c.id = reservation.course_id
                              join lesson l on l.id = c.lesson_id
                              join coach c2 on c.teacher_id = c2.id
                     where user_id = in_user_id
                     order by c.date_time desc, start_time;
    end if;
END;
$$;


ALTER FUNCTION public.query_reservations(in_user_id integer, in_open_id text) OWNER TO psycho;

--
-- Name: query_settings(); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.query_settings() RETURNS TABLE(close_book integer, close_booked integer, policy integer)
    LANGUAGE plpgsql
    AS $$
BEGIN

    RETURN QUERY select settings.close_book,
                        settings.close_booked,
                        settings.policy
                 from settings
                 where settings.id = 1
                 limit 1;
END;
$$;


ALTER FUNCTION public.query_settings() OWNER TO psycho;

--
-- Name: query_slideshows(); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.query_slideshows() RETURNS json
    LANGUAGE sql
    AS $$
select json_agg(jsonb_build_object('id', id,
                                   'image', image
    ))
from slideshow;
$$;


ALTER FUNCTION public.query_slideshows() OWNER TO psycho;

--
-- Name: query_teacher_lessons(integer); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.query_teacher_lessons(in_id integer) RETURNS json
    LANGUAGE sql
    AS $$
select json_agg(t)
from (
         select l.name,
                c.date_time,
                c.start_time,
                c.hidden,
                (select count(reservation.id) from reservation where reservation.course_id = c.id) lessons
         from course c
                  join lesson l on l.id = c.lesson_id
                  join coach c2 on c.teacher_id = c2.id
         where c2.id = in_id
         order by c.date_time
     ) t
$$;


ALTER FUNCTION public.query_teacher_lessons(in_id integer) OWNER TO psycho;

--
-- Name: query_teacher_lessons(integer, integer, text, integer, integer); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.query_teacher_lessons(input_start_time integer, input_end_time integer, input_open_id text, input_class_type integer, input_teacher_id integer DEFAULT 0) RETURNS TABLE(course_id integer, peoples integer, count bigint, reservation_id integer, start_time integer, end_time integer, date_time integer, lesson_name text, teacher_name text, thumbnail text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    if input_teacher_id = 0 then
        RETURN QUERY select course.id                                 as course_id,
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
                       ;
    else
        RETURN QUERY select course.id                                 as course_id,
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
        and teacher_id = input_teacher_id;
    end if;
END;
$$;


ALTER FUNCTION public.query_teacher_lessons(input_start_time integer, input_end_time integer, input_open_id text, input_class_type integer, input_teacher_id integer) OWNER TO psycho;

--
-- Name: query_teachers(); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.query_teachers() RETURNS json
    LANGUAGE sql
    AS $$
select json_agg(jsonb_build_object('id', id,
                                   'name', name,
                                   'thumbnail', thumbnail,
                                   'introduction', introduction
    ))
from coach;
$$;


ALTER FUNCTION public.query_teachers() OWNER TO psycho;

--
-- Name: query_teachers_list(); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.query_teachers_list() RETURNS json
    LANGUAGE sql
    AS $$
select json_agg(jsonb_build_object('id', id,
                                   'name', name,
                                   'thumbnail', thumbnail,
                                   'total', (select count(reservation.id)
                                             from reservation
                                                      join course c on c.id = reservation.course_id
                                             where c.teacher_id = coach.id),
                                   'creationTime', creation_time
    ))
from coach;
$$;


ALTER FUNCTION public.query_teachers_list() OWNER TO psycho;

--
-- Name: query_times_card(integer); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.query_times_card(in_vip_card_id integer) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    finished int;
    pending  int;
BEGIN
    select count(reservation.id)
    into finished
    from reservation
             join course c on c.id = reservation.course_id
    where c.hidden < 1
      and c.booked_count > 2
      and vc_id = in_vip_card_id;

   select count(*)
    into pending
    from reservation
             join course c2 on c2.id = reservation.course_id
    where c2.date_time = date_seconds()
      and c2.end_time > seconds()
      and vc_id = in_vip_card_id;

    return finished + pending;
END;
$$;


ALTER FUNCTION public.query_times_card(in_vip_card_id integer) OWNER TO psycho;

--
-- Name: query_user(integer); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.query_user(in_id integer) RETURNS json
    LANGUAGE sql
    AS $$
select jsonb_build_object('id', id,
                          'address', address,
                          'avatarUrl', avatar_url,
                          'gender', gender,
                          'name', name,
                          'nickName', nick_name,
                          'note', note,
                          'openId', open_id,
                          'phone', phone,
                          'userType', user_type,
                          'creationTime', creation_time,
                          'updatedTime', updated_time
           )
from "user"
where id = in_id
limit 1;
$$;


ALTER FUNCTION public.query_user(in_id integer) OWNER TO psycho;

--
-- Name: query_user(integer, text); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.query_user(input_id integer, in_open_id text) RETURNS TABLE(avatar_url text, name text, nick_name text, note text, open_id text, phone text, user_type integer)
    LANGUAGE plpgsql
    AS $$
BEGIN

    RETURN QUERY select "user".avatar_url,
                        "user".name,
                        "user".nick_name,
                        "user".note,
                        "user".open_id,
                        "user".phone,
                        "user".user_type
                 from "user"
                 where "user".id = input_id
                    or "user".open_id = in_open_id
                 limit 1;
END
$$;


ALTER FUNCTION public.query_user(input_id integer, in_open_id text) OWNER TO psycho;

--
-- Name: query_user_lesson(integer, text); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.query_user_lesson(input_id integer, in_open_id text) RETURNS TABLE(description text, image text, name text, date_time integer, start_time integer, booked_id integer, booked_count bigint)
    LANGUAGE plpgsql
    AS $$
BEGIN

    RETURN QUERY select lesson.description,
                        c3.thumbnail as image,
                        lesson.name,
                        c.date_time,
                        c.start_time,
                        (select reservation.id
                         from reservation
                                  join "user" u on u.id = reservation.user_id
                         where u.open_id = in_open_id
                           and reservation.course_id = input_id
                         limit 1)    as booked_id,
                        (select count(reservation.id)
                         from reservation
                                  join course c2 on c2.id = reservation.course_id
                         where c2.id = input_id)
                 from lesson
                          join course c on lesson.id = c.lesson_id
                          join coach c3 on c.teacher_id = c3.id
                 where c.id = input_id
                 limit 1;
END;
$$;


ALTER FUNCTION public.query_user_lesson(input_id integer, in_open_id text) OWNER TO psycho;

--
-- Name: query_user_lessons(integer); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.query_user_lessons(in_id integer) RETURNS json
    LANGUAGE sql
    AS $$
select json_agg(t)
from (
         select l.name,
                c.date_time,
                c.start_time,
                c.hidden,
                (select count(reservation.id) from reservation where reservation.course_id = c.id) lessons
         from course c
                  join lesson l on l.id = c.lesson_id
                  join coach c2 on c.teacher_id = c2.id
                  join reservation r on c.id = r.course_id
                  join "user" u on u.id = r.user_id
         where u.id = in_id
         order by c.date_time
     ) t
$$;


ALTER FUNCTION public.query_user_lessons(in_id integer) OWNER TO psycho;

--
-- Name: query_user_list(text); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.query_user_list(in_open_id text) RETURNS TABLE(id integer, avatar_url text, name text, nick_name text, card_id integer, creation_time bigint, reservations bigint, end_date integer, booked integer)
    LANGUAGE plpgsql
    AS $$
DECLARE
    has integer;
BEGIN
    select count("user".id)
    from "user"
    where "user".open_id = in_open_id
      and "user".user_type & 4 = 4
    into has;
    if has > 0 then
        RETURN QUERY select "user".id,
                            "user".avatar_url,
                            "user".name,
                            "user".nick_name,
                            t.card_id,
                            "user".creation_time,
                            (select count(reservation.id)
                             from reservation
                                      join course c on c.id = reservation.course_id
                             where c.hidden < 1
                               and reservation.user_id = "user".id),
                            t.end_date,
                            (case
                                 when t.card_id=4 then
                                       t.times-  (select * from query_times_card(t.id))
                                 else 0
                                end)
                     from "user"
                              left join lateral (
                         select *
                         from vip_card
                         where user_id = "user".id
                         order by creation_time desc
                         limit 1) as t on true;
    end if;
END;
$$;


ALTER FUNCTION public.query_user_list(in_open_id text) OWNER TO psycho;

--
-- Name: query_user_vip_cards(text, integer); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.query_user_vip_cards(in_open_id text, in_user_id integer) RETURNS TABLE(id integer, card_id integer, end_date integer, hidden integer, times integer, start_date integer, creation_time bigint, title text)
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- 是否为管理员
    has integer;
BEGIN
    /*

    用户类型4为管理员

    */


    select count("user".id)
    from "user"
    where "user".open_id = in_open_id
      and "user".user_type & 4 = 4
    into has;
    if has > 0 then
        RETURN QUERY select vip_card.id,
                            vip_card.card_id,
                            vip_card.end_date,
                            vip_card.hidden,
                            vip_card.times,
                            vip_card.start_date,
                            vip_card.creation_time,
                            c.title
                     from vip_card
                              join card c on c.id = vip_card.card_id
                     where vip_card.user_id = in_user_id
                     order by vip_card.creation_time desc;
    else
        RETURN QUERY select vip_card.id,
                            vip_card.card_id,
                             vip_card.end_date,
                            vip_card.hidden,
                            vip_card.times,
                            vip_card.start_date,
                            vip_card.creation_time,
                            c.title
                     from vip_card
                              join card c on c.id = vip_card.card_id
                     where vip_card.user_id = in_user_id
                       and hidden < 1
                     order by vip_card.creation_time desc;
    end if;
END;
$$;


ALTER FUNCTION public.query_user_vip_cards(in_open_id text, in_user_id integer) OWNER TO psycho;

--
-- Name: query_users(); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.query_users() RETURNS json
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
     ) t
where t.booked > 0
  and t.lasted > (unix() - 86400 * 15)
$$;


ALTER FUNCTION public.query_users() OWNER TO psycho;

--
-- Name: query_users(integer, text); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.query_users(input_id integer, input_open_id text) RETURNS TABLE(user_id integer, avatar_url text, nick_name text, creation_time bigint, reservation_id integer, user_booked integer, card_id integer)
    LANGUAGE plpgsql
    AS $$
DECLARE
    has      integer;
BEGIN
    select count(id)
    from "user"
    where "user".open_id = input_open_id
      and "user".user_type & 4 = 4
    into has;
    if has > 0 then
        RETURN QUERY select "user".id,
                            "user".avatar_url,
                            "user".nick_name,
                            r.creation_time,
                            r.id,
                            t.user_booked,
                            t.card_id
                     from "user"
                              left join reservation r on "user".id = r.user_id
                              left join course c on c.id = r.course_id
                              left join lateral (
                         select f.vc_id, f.card_id, f.user_booked
                         from query_last_vip_card("user".id) f(vc_id int, card_id int, user_booked int)
                         ) as t on true
                     where c.id = input_id
                     order by r.creation_time desc;
    else
        return ;
    end if;

END;
$$;


ALTER FUNCTION public.query_users(input_id integer, input_open_id text) OWNER TO psycho;

--
-- Name: query_users_all(); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.query_users_all() RETURNS json
    LANGUAGE sql
    AS $$
select json_agg(t)
from (select nick_name,
             avatar_url,
             u.creation_time,
             (select count(reservation.id) from reservation where reservation.user_id = u.id) booked,

             (select reservation.creation_time
              from reservation
              where reservation.user_id = u.id
              order by reservation.creation_time desc
              limit 1)                                                                        lasted,
             (select card_id from vip_card where vip_card.user_id =u.id order by vip_card.creation_time desc limit 1)                                                                        card_id
      from "user" u

     ) t
$$;


ALTER FUNCTION public.query_users_all() OWNER TO psycho;

--
-- Name: query_users_statistics(); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.query_users_statistics() RETURNS json
    LANGUAGE sql
    AS $$
with t as (
    select count(u.id) c
    from "user" u
             left join reservation r on u.id = r.user_id
    group by u.id),
     tt as (
         select count(id) cc
         from "user"
     )
select jsonb_build_object('total', (select count(*)
                                    from t), 'booked',
                          round((select count(*)
                                 from t
                                 where t.c > 1) * 100.0 /
                                (select cc from tt), 2));
$$;


ALTER FUNCTION public.query_users_statistics() OWNER TO psycho;

--
-- Name: query_vip_card_expired_date(integer, integer); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.query_vip_card_expired_date(in_id integer, in_card_id integer) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
    date_time_seconds  int;
    temp_creation_time bigint;
BEGIN

    /*
    获取仅包含日期的时间戳。

    86400为一天的秒钟数，28800为中国时区8小时的秒钟数。

    通过获取当前的时间戳，减掉取余获取的时间的秒钟数，得到仅包含日期的时间戳，再减掉中国时区，得到中国的时间戳。
    */


    date_time_seconds = floor(extract(epoch from date(now()))) - 28800;
    raise notice '---------------%',date_time_seconds;
-- 使用会员卡标识查找使用该会员卡第一次预约课程的时间

    select creation_time
    into temp_creation_time
    from reservation
    where vc_id = in_id
    order by creation_time
    limit 1;


-- 如果会员卡从未使用过，返回0
    if temp_creation_time is null then
        return 0;
    end if;
-- 次卡和年卡的有效期为1年
    if in_card_id = 4 or in_card_id = 3 then
        return temp_creation_time + 86400 * 364;
-- 周卡
    elseif in_card_id = 1 then
        return temp_creation_time + 86400 * 6;
-- 月卡
    elseif in_card_id = 2 then
        return temp_creation_time + 86400 * 29;
    end if;
    return 0;
END
$$;


ALTER FUNCTION public.query_vip_card_expired_date(in_id integer, in_card_id integer) OWNER TO psycho;

--
-- Name: query_week_lessons(); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.query_week_lessons() RETURNS TABLE(start_time integer, end_time integer, date_time integer, lesson_name text, teacher_name text)
    LANGUAGE plpgsql
    AS $$
DECLARE
    seconds      int;
    date_seconds int;
    week         int;
    date_times   int[];
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
    FOR i in 0..5
        LOOP
            date_times = array_append(date_times, date_seconds + 86400 * i);
        end loop;
    return query select course.start_time,
                        course.end_time,
                        course.date_time,
                        l.name,
                        c.name
                 from course
                          join lesson l on l.id = course.lesson_id
                          join coach c on course.teacher_id = c.id
                 where
                   --course.date_time >= 1665158400 and course.date_time <= (1665158400 + 86400* 6)
                     course.date_time = ANY (date_times)
                   and course.class_type = 4
                 order by date_time, start_time;
END
$$;


ALTER FUNCTION public.query_week_lessons() OWNER TO psycho;

--
-- Name: restart_serial(text); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.restart_serial(in_table text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    maxid int;
BEGIN
    execute 'select max(id) from ' || quote_ident(in_table) into maxid;
    execute 'alter SEQUENCE ' || in_table || '_id_seq RESTART with ' || maxid + 1;
END;
$$;


ALTER FUNCTION public.restart_serial(in_table text) OWNER TO psycho;

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
-- Name: unblock_user(integer); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.unblock_user(in_id integer) RETURNS integer
    LANGUAGE sql
    AS $$
update "user"
set user_type= 0
where id = in_id
returning id
$$;


ALTER FUNCTION public.unblock_user(in_id integer) OWNER TO psycho;

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
-- Name: update_announcement(json); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.update_announcement(obj json) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    result_id integer=0;
    seconds   bigint;
BEGIN
    select floor(extract(epoch from now())) into seconds;
    insert into announcement(id,content,
title,creation_time,updated_time)
    values (coalesce(NULLIF((obj ->>  'id')::int, 0), coalesce((select max(id) from announcement), 0) + 1),
     obj ->> 'content',
 obj ->> 'title'
        ,coalesce(NULLIF((obj ->>  'create_at')::bigint, 0), seconds),
        coalesce(NULLIF((obj ->>  'update_at')::bigint, 0), seconds)
        )
        ON CONFLICT (id) DO update
            set
            content = coalesce(obj ->>'content',announcement.content),
title = coalesce(obj ->>'title',announcement.title)
            ,creation_time = coalesce(NULLIF((obj ->>  'creation_time')::bigint, 0), announcement.creation_time),
                updated_time  = seconds
            returning id into result_id;
        RETURN result_id;
        END;
$$;


ALTER FUNCTION public.update_announcement(obj json) OWNER TO psycho;

--
-- Name: update_book(integer, text, integer, integer, text, integer, integer, text); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.update_book(in_id integer, in_open_id text, in_class_type integer, in_end_time integer, in_lesson_name text, in_peoples integer, in_start_time integer, in_teacher_name text) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    result_id integer=0;
    has       integer;
BEGIN
    select count(id)
    from "user"
    where "user".open_id = in_open_id
      and "user".user_type & 4 = 4
    into has;
    if has > 0 then
        update course
        set class_type = coalesce(NULLIF(in_class_type, 0), class_type),
            end_time   = coalesce(NULLIF(in_end_time, 0), end_time),
            id         = coalesce(NULLIF(in_id, 0), id),
            lesson_id  = coalesce((select id from lesson where name = in_lesson_name), lesson_id),
            peoples    = coalesce(NULLIF(in_peoples, 0), peoples),
            start_time = coalesce(NULLIF(in_start_time, 0), start_time),
            teacher_id = coalesce((select id from coach where name = in_teacher_name), teacher_id)
-- lesson_id  = coalesce((select id from lesson where name = '哈他基础'), lesson_id),
        where id = in_id
        returning id into result_id;
    end if;
    RETURN result_id;
END;
$$;


ALTER FUNCTION public.update_book(in_id integer, in_open_id text, in_class_type integer, in_end_time integer, in_lesson_name text, in_peoples integer, in_start_time integer, in_teacher_name text) OWNER TO psycho;

--
-- Name: update_coach(json); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.update_coach(obj json) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    result_id integer=0;
    seconds   bigint;
BEGIN
    select floor(extract(epoch from now())) into seconds;
    insert into coach(id,description,
introduction,
name,
open_id,
phone_number,
thumbnail,
coach_type,creation_time,updated_time)
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


ALTER FUNCTION public.update_coach(obj json) OWNER TO psycho;

--
-- Name: update_course_booked_count(); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.update_course_booked_count() RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    seconds int;
BEGIN
    seconds = date_seconds();
    update course
    set booked_count=(select count(*) from reservation where course_id = course.id)
    where id in (select id
                 from course
                 where (date_time < seconds
                     or (date_time = seconds and
                         end_time <= seconds()))
                   and booked_count is null);
END;
$$;


ALTER FUNCTION public.update_course_booked_count() OWNER TO psycho;

--
-- Name: update_lesson(integer, text, integer, integer, text, integer, integer, text); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.update_lesson(in_id integer, in_open_id text, in_class_type integer, in_end_time integer, in_lesson_name text, in_peoples integer, in_start_time integer, in_teacher_name text) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    result_id    integer=0;
    has          integer;
    v_date_time  integer;
    v_start_time integer;
    v_class_type integer;
    tmp          integer;
    ids          integer[];
BEGIN
    select count(id)
    from "user"
    where "user".open_id = in_open_id
      and "user".user_type & 4 = 4
    into has;
    if has > 0 then
        select date_time, start_time, class_type
        into v_date_time,v_start_time,v_class_type
        from course
        where course.id = in_id;
        raise notice 'v_date_time = % % %',v_date_time,v_start_time,v_class_type;

        ids = array(select id
                    from course
                    where date_time > v_date_time
                      and (date_time - v_date_time) % 604800 = 0
                      and start_time = v_start_time
                      and class_type = v_class_type);
        ids = array_append(ids, in_id);
        raise notice '%',ids;
        foreach tmp in array ids
            LOOP
                update course
                set class_type = coalesce(NULLIF(in_class_type, 0), class_type),
                    end_time   = coalesce(NULLIF(in_end_time, 0), end_time),
                    lesson_id  = coalesce((select id from lesson where name = in_lesson_name), lesson_id),
                    peoples    = coalesce(NULLIF(in_peoples, 0), peoples),
                    start_time = coalesce(NULLIF(in_start_time, 0), start_time),
                    teacher_id = coalesce((select id from coach where name = in_teacher_name), teacher_id)
                where id = tmp;
            end loop;

    end if;
    RETURN result_id;
END;
$$;


ALTER FUNCTION public.update_lesson(in_id integer, in_open_id text, in_class_type integer, in_end_time integer, in_lesson_name text, in_peoples integer, in_start_time integer, in_teacher_name text) OWNER TO psycho;

--
-- Name: update_lessons(integer, text); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.update_lessons(in_id integer, in_open_id text) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    result_id    integer=0;
    has          integer;
    v_date_time  integer;
    v_start_time integer;
    v_end_time   integer;
    v_class_type integer;
    v_teacher_id integer;
    v_peoples    integer;
    v_lesson_id  integer;
    tmp          integer;
    ids          integer[];
BEGIN
    select count(id)
    from "user"
    where "user".open_id = in_open_id
      and "user".user_type & 4 = 4
    into has;
    if has > 0 then
        select date_time, start_time, end_time, class_type, teacher_id, peoples, lesson_id
        into v_date_time,v_start_time, v_end_time ,v_class_type, v_teacher_id, v_peoples,v_lesson_id
        from course
        where course.id = in_id;
        raise notice 'v_date_time = % % %',v_date_time,v_start_time,v_class_type;

        ids = array(select id
                    from course
                    where date_time > v_date_time
                      and (date_time - v_date_time) % 604800 = 0
                      and start_time = v_start_time
                      and class_type = v_class_type);
        foreach tmp in array ids
            LOOP
                raise notice 'id %',tmp;
                update course
                set class_type = v_class_type,
                    end_time   = v_end_time,
                    lesson_id  = v_lesson_id,
                    peoples    = v_peoples,
                    start_time = v_start_time,
                    teacher_id = v_teacher_id
                where id = tmp;
            end loop;

    end if;
    RETURN result_id;
END;
$$;


ALTER FUNCTION public.update_lessons(in_id integer, in_open_id text) OWNER TO psycho;

--
-- Name: update_systeminfo(json, text); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.update_systeminfo(obj json, in_ip text) RETURNS integer
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


ALTER FUNCTION public.update_systeminfo(obj json, in_ip text) OWNER TO psycho;

--
-- Name: update_user(json); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.update_user(obj json) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    result_id integer=0;
    seconds   bigint;
BEGIN
    select floor(extract(epoch from now())) into seconds;
    update "user"
    set address       = coalesce(obj ->> 'address', "user".address),
        avatar_url    = coalesce(obj ->> 'avatarUrl', "user".avatar_url),
        gender        = coalesce(NULLIF((obj ->> 'gender')::integer, 0), "user".gender),
        name          = coalesce(obj ->> 'name', "user".name),
        nick_name     = coalesce(obj ->> 'nickName', "user".nick_name),
        note          = coalesce(obj ->> 'note', "user".note),
        phone         = coalesce(obj ->> 'phone', "user".phone),
        updated_time  = seconds
    where id = (obj ->> 'id')::int
    returning id into result_id;
    RETURN result_id;
END;
$$;


ALTER FUNCTION public.update_user(obj json) OWNER TO psycho;

--
-- Name: update_userinfo(json); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.update_userinfo(obj json) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    result_id integer=0;
    seconds   bigint;
BEGIN
    select floor(extract(epoch from now())) into seconds;
    insert into userinfo(id, username,
                         phone_number,
                         password, creation_time, updated_time)
    values (coalesce(NULLIF((obj ->> 'id')::int, 0), coalesce((select max(id) from userinfo), 0) + 1),
            obj ->> 'username',
            obj ->> 'phone_number',
            obj ->> 'password'
               , coalesce(NULLIF((obj ->> 'create_at')::bigint, 0), seconds),
            coalesce(NULLIF((obj ->> 'update_at')::bigint, 0), seconds))
    ON CONFLICT (id) DO update
        set username      = coalesce(obj ->> 'username', userinfo.username),
            phone_number  = coalesce(obj ->> 'phone_number', userinfo.phone_number),
            password      = coalesce(obj ->> 'password', userinfo.password)
                ,
            creation_time = coalesce(NULLIF((obj ->> 'creation_time')::bigint, 0), userinfo.creation_time),
            updated_time  = seconds
    returning id into result_id;
    RETURN result_id;
END;
$$;


ALTER FUNCTION public.update_userinfo(obj json) OWNER TO psycho;

--
-- Name: update_vip_card_dates(); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.update_vip_card_dates() RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    update vip_card
    set start_date = coalesce(nullif(first_booked_time(vip_card.user_id),0),vip_card.creation_time),
        end_date=extract(epoch from date(to_timestamp(coalesce(nullif(first_booked_time(vip_card.user_id),0),vip_card.creation_time))) + interval '1 year')
    where card_id = 3;
END;
$$;


ALTER FUNCTION public.update_vip_card_dates() OWNER TO psycho;

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
                 where course.hidden <> 1
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
            obj ->> 'address', obj ->> 'avatar_url', (obj ->> 'gender')::integer, obj ->> 'name', obj ->> 'nick_name',
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

--
-- Name: valid_times_card(integer); Type: FUNCTION; Schema: public; Owner: psycho
--

CREATE FUNCTION public.valid_times_card(in_vip_card_id integer) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    finished int;
    pending  int;
BEGIN
    select count(reservation.id)
    into finished
    from reservation
             join course c on c.id = reservation.course_id
    where c.hidden < 1
      and c.booked_count > 2
      and vc_id = in_vip_card_id;

    raise notice 'Query the number of completed courses booked with this vip card: %',finished;

    select count(*)
    into pending
    from reservation
             join course c2 on c2.id = reservation.course_id
    where (c2.date_time > date_seconds() or (c2.date_time = date_seconds()
        and c2.end_time > seconds()))
      and vc_id = in_vip_card_id;

    raise notice 'Query the number of uncompleted courses booked with this vip card: %',pending;

    if (select times from vip_card where id = in_vip_card_id) - (finished + pending) > 0 then
        return 1;
    end if;
    return 0;
END;
$$;


ALTER FUNCTION public.valid_times_card(in_vip_card_id integer) OWNER TO psycho;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: access_record; Type: TABLE; Schema: public; Owner: psycho
--

CREATE TABLE public.access_record (
    id integer NOT NULL,
    uri text NOT NULL,
    open_id text NOT NULL,
    ip text,
    creation_time bigint NOT NULL,
    updated_time bigint NOT NULL
);


ALTER TABLE public.access_record OWNER TO psycho;

--
-- Name: access_record_id_seq; Type: SEQUENCE; Schema: public; Owner: psycho
--

CREATE SEQUENCE public.access_record_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.access_record_id_seq OWNER TO psycho;

--
-- Name: access_record_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: psycho
--

ALTER SEQUENCE public.access_record_id_seq OWNED BY public.access_record.id;


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
-- Name: access_record id; Type: DEFAULT; Schema: public; Owner: psycho
--

ALTER TABLE ONLY public.access_record ALTER COLUMN id SET DEFAULT nextval('public.access_record_id_seq'::regclass);


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
-- Name: access_record access_record_pkey; Type: CONSTRAINT; Schema: public; Owner: psycho
--

ALTER TABLE ONLY public.access_record
    ADD CONSTRAINT access_record_pkey PRIMARY KEY (id);


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

