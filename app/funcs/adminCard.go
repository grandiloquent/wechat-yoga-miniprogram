package funcs

import (
	"database/sql"
	"net/http"
)

func AdminCard(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
	switch r.Method {
	case "GET":
		adminCardGet(db, w, r, secret)
		return
	case "DELETE":
		adminCardDelete(db, w, r, secret)
		return
	case "POST":
		adminCardPost(db, w, r, secret)
		return
	case "OPTIONS":
		adminCardOptions(db, w, r, secret)
		return
	case "PUT":
		adminCardPut(db, w, r, secret)
		return
	}
}
func adminCardGet(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
	switch r.URL.Query().Get("action") {
	case "1":
		queryJSON(w, db, "select * from v1_admin_cards()")
		break
	case "2":
		break
	default:
		id := r.URL.Query().Get("id")
		if len(id) == 0 {
			http.NotFound(w, r)
			return
		}
		queryJSON(w, db, "select * from v1_admin_card($1)", id)
		break
	}

}
func adminCardDelete(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
}
func adminCardPost(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
	insertNumber(db, w, r, "select * from v1_admin_card_update($1)")
}
func adminCardOptions(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
}
func adminCardPut(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
}
