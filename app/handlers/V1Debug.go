package handlers

import (
	"database/sql"
	"encoding/json"
	"io"
	"net/http"
)

/*
create or replace function v1_debug() returns json
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
func V1Debug(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	xforward := r.Header.Get("X-Forwarded-For")
	buf, err := io.ReadAll(r.Body)
	if CheckError(w, err) {
		return
	}
	if len(buf) == 0 {
		http.NotFound(w, r)
		return
	}
	var data interface{}
	err = json.Unmarshal(buf, &data)
	if CheckError(w, err) {
		return
	}
	buf, err = QueryRow(db, "select * from v1_debug($1,$2)", string(buf), xforward)
	if CheckError(w, err) {
		return
	}
	w.Header().Set("Content-Type", "text/plain; charset=utf-8")
	w.Write(buf)
}
