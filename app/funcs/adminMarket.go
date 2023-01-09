package funcs

import (
	"database/sql"
	"net/http"
)

func AdminMarket(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
	switch r.Method {
	case "GET":
		adminMarketGet(db, w, r, secret)
		return
	case "DELETE":
		adminMarketDelete(db, w, r, secret)
		return
	case "POST":
		adminMarketPost(db, w, r, secret)
		return
	case "OPTIONS":
		adminMarketOptions(db, w, r, secret)
		return
	case "PUT":
		adminMarketPut(db, w, r, secret)
		return
	}
}
func adminMarketGet(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
	switch r.URL.Query().Get("action") {
	case "1":
		break
	case "2":
		break
	default:
		queryJSON(w, db, "select * from v1_admin_market()")
		break
	}

}
func adminMarketDelete(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
}
func adminMarketPost(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
	insertNumber(db, w, r, "select * from v1_admin_market_update($1)")

}
func adminMarketOptions(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
}
func adminMarketPut(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
}
