package handlers

import (
	"database/sql"
	"net/http"
)

func V1UserUser(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	openId := r.URL.Query().Get("openId")
	if len(openId) == 0 {
		http.NotFound(w, r)
		return
	}
	QueryJSON(w, db, "select * from v1_user_user($1)", openId)
}
