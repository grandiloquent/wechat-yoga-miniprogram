package handlers

import (
	"database/sql"
	"net/http"
)

/*

 */

func V1AdminLessons(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
	CrossOrigin(w)
	if r.Method == "OPTIONS" {
		return
	}
	start := r.URL.Query().Get("start")
	if len(start) == 0 {
		http.NotFound(w, r)
		return
	}
	end := r.URL.Query().Get("end")
	if len(end) == 0 {
		http.NotFound(w, r)
		return
	}
	if !validToken(db, w, r, secret) {
		return
	}
	QueryJSON(w, db, "select * from v1_admin_lessons($1,$2,5)", start, end)
}
