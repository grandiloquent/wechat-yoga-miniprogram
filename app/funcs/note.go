package funcs

import (
	"database/sql"
	"net/http"
)

func Note(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
	switch r.Method {
	case "GET":
		noteGet(db, w, r, secret)
		return
	case "DELETE":
		noteDelete(db, w, r, secret)
		return
	case "POST":
		notePost(db, w, r, secret)
		return
	case "OPTIONS":
		noteOptions(db, w, r, secret)
		return
	case "PUT":
		notePut(db, w, r, secret)
		return
	}
}
func noteGet(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
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
		queryJSON(w, db, "select * from v1_admin_note($1)", id)
		break
	}

}
func noteDelete(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
}
func notePost(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
	if !ValidToken(db, w, r, secret) {
		return
	}
	insertNumber(db, w, r, "select * from v1_admin_note_update($1)")
}
func noteOptions(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
}
func notePut(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
}
