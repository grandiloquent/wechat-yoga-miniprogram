package handlers

import (
	"database/sql"
	"net/http"
)

func V1AdminNoticeDelete(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
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

	QueryInt(w, db, "select * from v1_admin_notice_delete($1)", id)
}
