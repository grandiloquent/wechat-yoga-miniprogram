package funcs

import (
	"database/sql"
	"net/http"
)

func Snippet(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
	crossOrigin(w)
	switch r.Method {
	case "GET":
		snippetGet(db, w, r, secret)
		return
	case "DELETE":
		snippetDelete(db, w, r, secret)
		return
	case "POST":
		snippetPost(db, w, r, secret)
		return
	case "OPTIONS":
		snippetOptions(db, w, r, secret)
		return
	case "PUT":
		snippetPut(db, w, r, secret)
		return
	}
}
func snippetGet(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
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
func snippetDelete(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
}
func snippetPost(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
	insertNumber(db, w, r, "select * from update_snippet($1)")

}
func snippetOptions(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
}
func snippetPut(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
	id := r.URL.Query().Get("id")
	if len(id) == 0 {
		http.NotFound(w, r)
		return
	}
	queryInt(w, db, "select * from v1_snippet_hit($1)", id)
}
