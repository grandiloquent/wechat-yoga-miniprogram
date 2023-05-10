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