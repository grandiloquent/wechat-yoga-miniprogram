package funcs

import (
	"database/sql"
	"net/http"
)

func User(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
	switch r.Method {
	case "GET":
		userGet(db, w, r, secret)
		return
	case "DELETE":
		userDelete(db, w, r, secret)
		return
	case "POST":
		userPost(db, w, r, secret)
		return
	}
}
func userGet(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {

	switch r.URL.Query().Get("action") {
	case "1":
		openId := r.URL.Query().Get("openId")
		if len(openId) == 0 {
			http.NotFound(w, r)
			return
		}
		queryInt(w, db, "select * from v1_user_check($1)", openId)
		break
	case "2":
		openId := r.URL.Query().Get("openId")
		if len(openId) == 0 {
			http.NotFound(w, r)
			return
		}
		queryJSON(w, db, "select * from v1_user_user($1)", openId)
		break
	}

}
func userDelete(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
}
func userPost(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
	insertNumber(db, w, r, "select * from v1_user_update($1)")
}
