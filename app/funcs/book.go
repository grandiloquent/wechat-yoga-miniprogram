package funcs

import (
	"database/sql"
	"net/http"
)

func Book(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	switch r.Method {
	case "GET":
		bookGet(db, w, r)
		return
	case "DELETE":
		bookDelete(db, w, r)
		return
	case "POST":
		bookPost(db, w, r)
		return
	case "OPTIONS":
		bookOptions(db, w, r)
		return
	case "PUT":
		bookPut(db, w, r)
		return
	}
}
func bookGet(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	switch r.URL.Query().Get("action") {
	case "1":
		break
	case "2":
		break
	default:
		openId := r.URL.Query().Get("openId")
		if len(openId) == 0 {
			http.NotFound(w, r)
			return
		}
		id := r.URL.Query().Get("id")
		if len(id) == 0 {
			http.NotFound(w, r)
			return
		}
		queryJSON(w, db, "select * from v1_book($1,$2)", id, openId)
		break
	}

}
func bookDelete(db *sql.DB, w http.ResponseWriter, r *http.Request) {
}
func bookPost(db *sql.DB, w http.ResponseWriter, r *http.Request) {
}
func bookOptions(db *sql.DB, w http.ResponseWriter, r *http.Request) {
}
func bookPut(db *sql.DB, w http.ResponseWriter, r *http.Request) {
}
