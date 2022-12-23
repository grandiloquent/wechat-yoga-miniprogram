package handlers

import (
	"database/sql"
	"net/http"
)

func V1AdminMarket(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
	CrossOrigin(w)
	if r.Method == "OPTIONS" {
		return
	}
	if !validToken(db, w, r, secret) {
		return
	}

	QueryJSON(w, db, "select * from v1_admin_market()")
}
