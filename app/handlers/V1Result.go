package handlers

import (
	"database/sql"
	"net/http"
)
/*
create or replace function v1_result() returns json
    language sql
as
$$
select json_agg(t)
from (
         select id,
                image
         from slideshow
     ) as t
$$;
*/
func V1Result(db *sql.DB, w http.ResponseWriter, r *http.Request) {
    openId := r.URL.Query().Get("openId")
	if len(openId) == 0 {
		http.NotFound(w, r)
    return
	}
	QueryJSON(w, db, "select * from v1_result($1)",openId)
}