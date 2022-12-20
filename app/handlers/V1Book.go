package handlers

import (
	"database/sql"
	"net/http"
)

/*
 
create or replace function v1_book(input_course_id integer, input_open_id text) returns integer
    language plpgsql
as
$$
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


    -- 检查微信标识格式是否正确


    -- 微信标识必须为长度28的字符串
    if input_open_id is null or length(input_open_id) != 28 then
        return -103;
    end if;


    --  检查学员是否被屏蔽

    -- 通过微信标识从学员表中查找用户标识和类型
    select id, user_type into v_user_id,v_user_type from "user" where open_id = input_open_id;

    -- 类型-1：已屏蔽的学员
    if v_user_type = -1 then
        return -100;
    end if;


    -- 检查课程是否已满额


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

    -- 检查课程是否已过期


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

    -- 查询用户购买的会员卡，获取第一张可用会员卡的标识
    -- 周卡、月卡、年卡检查是否已过期
    -- 次卡检查是否已过期，以及是否有足够的次数


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

*/
func V1Book(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	openId := r.URL.Query().Get("openId")
	if len(openId) == 0 {
		http.NotFound(w, r)
		return
	}
	id := r.URL.Query().Get("id")
	if len(id) == 0 {
		http.NotFound(w, r)
		return
	}
	QueryJSON(w, db, "select * from v1_book($1,$2)", openId, id)
}
