package funcs

import (
	"database/sql"
	"net/http"
)

func AdminUser(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	switch r.Method {
	case "GET":
		adminUserGet(db, w, r)
		return
	case "DELETE":
		adminUserDelete(db, w, r)
		return
	case "POST":
		adminUserPost(db, w, r)
		return
	}
}
func adminUserGet(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	queryJSON(w, db, "select * from v1_admin_users()")
}
func adminUserDelete(db *sql.DB, w http.ResponseWriter, r *http.Request) {
}
func adminUserPost(db *sql.DB, w http.ResponseWriter, r *http.Request) {
}
