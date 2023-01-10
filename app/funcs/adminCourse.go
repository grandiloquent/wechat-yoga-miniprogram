package funcs

import (
	"database/sql"
	"net/http"
)

func AdminCourse(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	switch r.Method {
	case "GET":
		adminCourseGet(db, w, r)
		return
	case "DELETE":
		adminCourseDelete(db, w, r)
		return
	case "POST":
		adminCoursePost(db, w, r)
		return
	case "OPTIONS":
		adminCourseOptions(db, w, r)
		return
	case "PUT":
		adminCoursePut(db, w, r)
		return
	}
}
func adminCourseGet(db *sql.DB, w http.ResponseWriter, r *http.Request) {
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
func adminCourseDelete(db *sql.DB, w http.ResponseWriter, r *http.Request) {
}
func adminCoursePost(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	insertNumber(db, w, r, "select * from v1_admin_course_update($1)")

}
func adminCourseOptions(db *sql.DB, w http.ResponseWriter, r *http.Request) {
}
func adminCoursePut(db *sql.DB, w http.ResponseWriter, r *http.Request) {
}
