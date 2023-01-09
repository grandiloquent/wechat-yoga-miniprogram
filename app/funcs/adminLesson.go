package funcs

import (
	"database/sql"
	"net/http"
)

func AdminLesson(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
	if r.Method == "GET" {
		id := getId(w, r)
		if id == "" {
			return
		}
		action := r.URL.Query().Get("action")
		if action == "1" {
			queryInt(w, db, "select * from v1_admin_lesson_update_status($1,$2)", id, 1)
			return
		}
		if action == "2" {
			queryInt(w, db, "select * from v1_admin_lesson_update_status($1,$2)", id, 0)
			return
		}
		// 通过调用数据库自定义函数进行查询操作
		// 成功返回Json，失败空字符串
		queryJSON(w, db, "select * from v1_admin_lesson($1)", id)
	} else if r.Method == "DELETE" {
		id := getId(w, r)
		if id == "" {
			return
		}
		queryInt(w, db, "select * from v1_admin_lesson_delete($1)", id)
	} else if r.Method == "POST" {
		insertNumber(db, w, r, "select * from v1_admin_lesson_update($1)")
	}
}
