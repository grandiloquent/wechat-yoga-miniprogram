```pgsql
CREATE OR REPLACE FUNCTION fn_user_query(in_id text)
    RETURNS json
    LANGUAGE sql
AS
$function$
select row_to_json(t)
from (select u.id,
             avatar_url,
             nick_name,
             user_type
      from "user" u
      where u.open_id = in_id) as t
$function$
```

```
CREATE OR REPLACE FUNCTION fn_user_update(obj json)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
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
$function$
```