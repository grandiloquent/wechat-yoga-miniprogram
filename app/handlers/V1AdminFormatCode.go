package handlers

import (
	"database/sql"
	"net/http"
)
/*
create or replace function v1_admin_formatCode() returns json
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
create or replace function v1_admin_formatCode(in_id int) returns json
    language sql
as
$$
select row_to_json(t)
from (
         select *
         from announcement
         where id = in_id
         limit 1) as t
$$;
*/
func V1AdminFormatCode(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
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
      
	QueryJSON(w, db, "select * from v1_admin_formatCode($1)",id)
}