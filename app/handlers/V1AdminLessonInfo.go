package handlers

import (
	"database/sql"
	"net/http"
)
 
func V1AdminLessonInfo(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
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

	QueryJSON(w, db, "select * from v1_admin_lesson_info($1)", id)
}
