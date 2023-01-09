package funcs

import (
	"database/sql"
	"net/http"
)

func AdminUser(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
	switch r.Method {
	case "GET":
		adminUserGet(db, w, r, secret)
		return
	case "DELETE":
		adminUserDelete(db, w, r, secret)
		return
	case "POST":
		adminUserPost(db, w, r, secret)
		return
	}
}
func adminUserGet(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
	queryJSON(w, db, "select * from v1_admin_users()")
}
func adminUserDelete(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
}
func adminUserPost(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
}
