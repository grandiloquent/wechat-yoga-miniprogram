package handlers

import (
	"database/sql"
	"net/http"
)

/*

 */
func V1Unbook(db *sql.DB, w http.ResponseWriter, r *http.Request) {

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
	QueryInt(w, db, "select * from v1_unbook($1,$2)", id, openId)
}
