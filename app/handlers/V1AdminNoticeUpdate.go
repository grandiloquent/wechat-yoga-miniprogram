package handlers

import (
	"database/sql"
	"net/http"
)

/*

 */
func V1AdminNoticeUpdate(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
	CrossOrigin(w)
	if r.Method == "OPTIONS" {
		return
	}
	if !validToken(db, w, r, secret) {
		return
	}
	InsertNumber(db, w, r, "select * from v1_admin_notice_update($1)")
}
