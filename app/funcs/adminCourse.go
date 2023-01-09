package funcs

import (
	"database/sql"
	"net/http"
)

func AdminCourse(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
	switch r.Method {
	case "GET":
		adminCourseGet(db, w, r, secret)
		return
	case "DELETE":
		adminCourseDelete(db, w, r, secret)
		return
	case "POST":
		adminCoursePost(db, w, r, secret)
		return
	case "OPTIONS":
		adminCourseOptions(db, w, r, secret)
		return
	case "PUT":
		adminCoursePut(db, w, r, secret)
		return
	}
}
func adminCourseGet(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
	switch r.URL.Query().Get("action") {
	case "1":
		break
	case "2":
		break
	default:
		id := getId(w, r)
		if id == "" {
			return
		}
		queryJSON(w, db, "select * from v1_admin_course($1)", id)
		break
	}

}
func adminCourseDelete(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
}
func adminCoursePost(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
	insertNumber(db, w, r, "select * from v1_admin_course_update($1)")

}
func adminCourseOptions(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
}
func adminCoursePut(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
}
