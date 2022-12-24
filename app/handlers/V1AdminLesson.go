package handlers

import (
	"database/sql"
	"net/http"
)

/*
create or replace function v1_admin_lesson() returns json
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
func V1AdminLesson(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
	CrossOrigin(w)
	if r.Method == "OPTIONS" {
		return
	}
	id := r.URL.Query().Get("id")
	if len(id) == 0 {
		http.NotFound(w, r)
		return
	}
	if !validToken(db, w, r, secret) {
		return
	}

	QueryJSON(w, db, "select * from v1_admin_lesson($1)", id)
}
