package handlers

import (
	"database/sql"
	"net/http"
)

func V1AdminNotes(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
	CrossOrigin(w)
	if r.Method == "OPTIONS" {
		return
	}

	QueryJSON(w, db, "select * from v1_admin_notes()")
}
