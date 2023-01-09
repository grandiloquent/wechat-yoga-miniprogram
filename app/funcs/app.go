package funcs

import (
	"database/sql"
	"net/http"
)

func App(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
	switch r.Method {
	case "GET":
		appGet(db, w, r, secret)
		return
	case "DELETE":
		appDelete(db, w, r, secret)
		return
	case "POST":
		appPost(db, w, r, secret)
		return
	case "OPTIONS":
		appOptions(db, w, r, secret)
		return
	case "PUT":
		appPut(db, w, r, secret)
		return
	}
}
func appGet(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
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
func appDelete(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
}
func appPost(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
}
func appOptions(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
}
func appPut(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
}
