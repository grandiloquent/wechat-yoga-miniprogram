package funcs

import (
	"database/sql"
	"net/http"
)

func AdminLesson(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	switch r.Method {
	case "GET":
		adminLessonGet(db, w, r)
		return
	case "DELETE":
		adminLessonDelete(db, w, r)
		return
	case "POST":
		adminLessonPost(db, w, r)
		return
	}
}
func adminLessonPost(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	action := r.URL.Query().Get("action")
	if action == "1" {
		insertNumber(db, w, r, "select * from v1_admin_lessons_update($1)")
		return
	}
	insertNumber(db, w, r, "select * from v1_admin_lesson_update($1)")
}
func adminLessonDelete(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	id := getId(w, r)
	if id == "" {
		return
	}
	queryInt(w, db, "select * from v1_admin_lesson_delete($1)", id)
}

func adminLessonGet(db *sql.DB, w http.ResponseWriter, r *http.Request) {

	action := r.URL.Query().Get("action")
	if action == "1" {
		id := getId(w, r)
		if id == "" {
			return
		}
		queryInt(w, db, "select * from v1_admin_lesson_update_status($1,$2)", id, 1)
		return
	}
	if action == "2" {
		id := getId(w, r)
		if id == "" {
			return
		}
		queryInt(w, db, "select * from v1_admin_lesson_update_status($1,$2)", id, 0)
		return
	}
	if action == "3" {
		queryJSON(w, db, "select * from v1_admin_lesson_info()")
		return
	}
	if action == "4" {
		queryJSON(w, db, "select * from v1_admin_lesson_names()")
		return
	}
	if action == "5" {
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
		queryJSON(w, db, "select * from v1_admin_lessons($1,$2,5)", start, end)
		return
	}
	// 通过调用数据库自定义函数进行查询操作
	// 成功返回Json，失败空字符串
	id := getId(w, r)
	if id == "" {
		return
	}
	queryJSON(w, db, "select * from v1_admin_lesson($1)", id)
}
