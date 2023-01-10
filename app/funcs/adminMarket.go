package funcs

import (
	"database/sql"
	"net/http"
)

func AdminMarket(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	switch r.Method {
	case "GET":
		adminMarketGet(db, w, r)
		return
	case "DELETE":
		adminMarketDelete(db, w, r)
		return
	case "POST":
		adminMarketPost(db, w, r)
		return
	case "OPTIONS":
		adminMarketOptions(db, w, r)
		return
	case "PUT":
		adminMarketPut(db, w, r)
		return
	}
}
func adminMarketGet(db *sql.DB, w http.ResponseWriter, r *http.Request) {
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
func adminMarketDelete(db *sql.DB, w http.ResponseWriter, r *http.Request) {
}
func adminMarketPost(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	insertNumber(db, w, r, "select * from v1_admin_market_update($1)")

}
func adminMarketOptions(db *sql.DB, w http.ResponseWriter, r *http.Request) {
}
func adminMarketPut(db *sql.DB, w http.ResponseWriter, r *http.Request) {
}
