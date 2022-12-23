package handlers

import (
	"database/sql"
	"net/http"
)

func V1AdminTeacherUpdate(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
	CrossOrigin(w)
	if r.Method == "OPTIONS" {
		return
	}

	if !validToken(db, w, r, secret) {
		return
	}

	InsertNumber(db, w, r, "select * from v1_admin_teacher_update($1)")
}
