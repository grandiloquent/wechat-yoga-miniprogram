package funcs

import (
	"database/sql"
	"net/http"
)

func AdminVipcard(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
	switch r.Method {
	case "GET":
		adminVipcardGet(db, w, r, secret)
		return
	case "DELETE":
		adminVipcardDelete(db, w, r, secret)
		return
	case "POST":
		adminVipcardPost(db, w, r, secret)
		return
	case "OPTIONS":
		adminVipcardOptions(db, w, r, secret)
		return
	case "PUT":
		adminVipcardPut(db, w, r, secret)
		return
	}
}
func adminVipcardGet(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
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
		queryJSON(w, db, "select * from v1_admin_vipcard($1)", id)
		break
	}

}
func adminVipcardDelete(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
}
func adminVipcardPost(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
	insertNumber(db, w, r, "select * from v1_admin_vipcard_update($1)")
}
func adminVipcardOptions(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
}
func adminVipcardPut(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
}
