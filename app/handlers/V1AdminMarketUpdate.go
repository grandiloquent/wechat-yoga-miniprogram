package handlers

import (
	"database/sql"
	"net/http"
)

func V1AdminMarketUpdate(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
	CrossOrigin(w)
	if r.Method == "OPTIONS" {
		return
	}

	if !validToken(db, w, r, secret) {
		return
	}

	InsertNumber(db, w, r, "select * from v1_admin_market_update($1)")
}
