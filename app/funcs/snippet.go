package funcs

import (
	"database/sql"
	"net/http"
)

func Snippet(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	crossOrigin(w)
	switch r.Method {
	case "GET":
		snippetGet(db, w, r)
		return
	case "DELETE":
		snippetDelete(db, w, r)
		return
	case "POST":
		snippetPost(db, w, r)
		return
	case "OPTIONS":
		snippetOptions(db, w, r)
		return
	case "PUT":
		snippetPut(db, w, r)
		return
	}
}
func snippetGet(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	switch r.URL.Query().Get("action") {
	case "1":
		break
	case "2":
		break
	default:
		id := r.URL.Query().Get("id")
		if len(id) == 0 {
			http.NotFound(w, r)
			return
		}
		queryJSON(w, db, "select * from v1_snippet($1)", id)
		break
	}

}
func snippetDelete(db *sql.DB, w http.ResponseWriter, r *http.Request) {
}
func snippetPost(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	insertNumber(db, w, r, "select * from update_snippet($1)")

}
func snippetOptions(db *sql.DB, w http.ResponseWriter, r *http.Request) {
}
func snippetPut(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	id := r.URL.Query().Get("id")
	if len(id) == 0 {
		http.NotFound(w, r)
		return
	}
	queryInt(w, db, "select * from v1_snippet_hit($1)", id)
}
