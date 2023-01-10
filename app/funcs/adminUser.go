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

	switch r.URL.Query().Get("action") {
	case "1":
		id := r.URL.Query().Get("id")
		if len(id) == 0 {
			http.NotFound(w, r)
			return
		}

		// 待查询课程的起始时间
		start := getInt("start", w, r)
		if start == "" {
			return
		}
		// 待查询课程的结束时间
		end := getInt("end", w, r)
		if end == "" {
			return
		}
		queryJSON(w, db, "select * from v1_admin_user_lessons($1,$2,$3)", id, start, end)
		break
	case "2":

		queryJSON(w, db, "select * from v1_admin_users()")
		break
	default:
		id := r.URL.Query().Get("id")
		if len(id) == 0 {
			http.NotFound(w, r)
			return
		}
		queryJSON(w, db, "select * from v1_admin_user($1)", id)
		break
	}
}
func adminUserDelete(db *sql.DB, w http.ResponseWriter, r *http.Request) {
}
func adminUserPost(db *sql.DB, w http.ResponseWriter, r *http.Request) {
}
