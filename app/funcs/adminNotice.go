package funcs

import (
	"database/sql"
	"net/http"
)

func AdminNotice(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	switch r.Method {
	case "GET":
		adminNoticeGet(db, w, r)
		return
	case "DELETE":
		adminNoticeDelete(db, w, r)
		return
	case "POST":
		adminNoticePost(db, w, r)
		return
	}
}
func adminNoticeGet(db *sql.DB, w http.ResponseWriter, r *http.Request) {

	switch r.URL.Query().Get("action") {
	case "1":
		queryJSON(w, db, "select * from v1_admin_notices()")
		break
	default:
		id := getId(w, r)
		if id == "" {
			return
		}
		queryJSON(w, db, "select * from v1_admin_notice($1)", id)
		break
	}

}
func adminNoticeDelete(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	id := getId(w, r)
	if id == "" {
		return
	}
	queryInt(w, db, "select * from v1_admin_notice_delete($1)", id)
}
func adminNoticePost(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	insertNumber(db, w, r, "select * from v1_admin_notice_update($1)")
}
