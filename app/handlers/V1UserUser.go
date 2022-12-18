package handlers

import (
	"database/sql"
	"net/http"
)

/*
create or replace function v1_user_user(in_id text) returns json
    language sql
as
$$
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

*/
func V1UserUser(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	openId := r.URL.Query().Get("openId")
	if len(openId) == 0 {
		http.NotFound(w, r)
		return
	}
	QueryJSON(w, db, "select * from v1_user_user($1)", openId)
}
