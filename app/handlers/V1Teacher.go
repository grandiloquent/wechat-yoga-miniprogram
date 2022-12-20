package handlers

import (
	"database/sql"
	"net/http"
)

/*
create or replace function v1_teacher(in_id integer) returns json
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
func V1Teacher(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	id := r.URL.Query().Get("id")
	if len(id) == 0 {
		http.NotFound(w, r)
		return
	}
	QueryJSON(w, db, "select * from v1_teacher($1)", id)
}
