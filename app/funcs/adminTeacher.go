package funcs

import (
	"database/sql"
	"net/http"
)

func AdminTeacher(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	switch r.Method {
	case "GET":
		adminTeacherGet(db, w, r)
		return
	case "DELETE":
		adminTeacherDelete(db, w, r)
		return
	case "POST":
		adminTeacherPost(db, w, r)
		return
	case "OPTIONS":
		adminTeacherOptions(db, w, r)
		return
	case "PUT":
		adminTeacherPut(db, w, r)
		return
	}
}
func adminTeacherGet(db *sql.DB, w http.ResponseWriter, r *http.Request) {
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
		id := r.URL.Query().Get("id")
		if len(id) == 0 {
			http.NotFound(w, r)
			return
		}
		queryJSON(w, db, "select * from v1_admin_user($1)", id)
		break
	default:
		id := r.URL.Query().Get("id")
		if len(id) == 0 {
			http.NotFound(w, r)
			return
		}
		queryJSON(w, db, "select * from v1_admin_teacher($1)", id)
		break
	}

}
func adminTeacherDelete(db *sql.DB, w http.ResponseWriter, r *http.Request) {
}
func adminTeacherPost(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	insertNumber(db, w, r, "select * from v1_admin_teacher_update($1)")
}
func adminTeacherOptions(db *sql.DB, w http.ResponseWriter, r *http.Request) {
}
func adminTeacherPut(db *sql.DB, w http.ResponseWriter, r *http.Request) {
}
