package funcs

import (
	"database/sql"
	"net/http"
)

func User(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	switch r.Method {
	case "GET":
		userGet(db, w, r)
		return
	case "DELETE":
		userDelete(db, w, r)
		return
	case "POST":
		userPost(db, w, r)
		return
	}
}
func userGet(db *sql.DB, w http.ResponseWriter, r *http.Request) {

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
func userDelete(db *sql.DB, w http.ResponseWriter, r *http.Request) {
}
func userPost(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	insertNumber(db, w, r, "select * from v1_user_update($1)")
}
