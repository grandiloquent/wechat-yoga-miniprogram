package handlers

import (
	"database/sql"
	"net/http"
)

func V1AdminNote(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
	CrossOrigin(w)
	if r.Method == "OPTIONS" {
		return
	}
	if r.Method == "GET" {
		id := r.URL.Query().Get("id")
		if len(id) == 0 {
			http.NotFound(w, r)
			return
		}
		QueryJSON(w, db, "select * from v1_admin_note($1)", id)
	} else if r.Method == "POST" {
		if !validToken(db, w, r, secret) {
			return
		}
		InsertNumber(db, w, r, "select * from v1_admin_note_update($1)")
	}
}
