package handlers

import (
	"database/sql"
	"net/http"
)

/*
create or replace function v1_admin_notices() returns json
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
func V1AdminNotices(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
	CrossOrigin(w)
	if r.Method == "OPTIONS" {
		return
	}
	if !validToken(db, w, r, secret) {
		return
	}
	QueryJSON(w, db, "select * from v1_admin_notices()")
}
