package handlers

import (
	"database/sql"
	"net/http"
)

/*

 */
func V1UserCheck(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	openId := r.URL.Query().Get("openId")
	if len(openId) == 0 {
		http.NotFound(w, r)
		return
	}
	QueryInt(w, db, "select * from v1_user_check($1)", openId)
}
