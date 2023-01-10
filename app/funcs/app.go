package funcs

import (
	"database/sql"
	"net/http"
)

func App(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	switch r.Method {
	case "GET":
		appGet(db, w, r)
		return
	case "DELETE":
		appDelete(db, w, r)
		return
	case "POST":
		appPost(db, w, r)
		return
	case "OPTIONS":
		appOptions(db, w, r)
		return
	case "PUT":
		appPut(db, w, r)
		return
	}
}
func appGet(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	switch r.URL.Query().Get("action") {
	case "1":
		break
	case "2":
		break
	default:
		queryJSON(w, db, "select * from v1_home()")
		break
	}

}
func appDelete(db *sql.DB, w http.ResponseWriter, r *http.Request) {
}
func appPost(db *sql.DB, w http.ResponseWriter, r *http.Request) {
}
func appOptions(db *sql.DB, w http.ResponseWriter, r *http.Request) {
}
func appPut(db *sql.DB, w http.ResponseWriter, r *http.Request) {
}
