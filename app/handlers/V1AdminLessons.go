package handlers

import (
	"database/sql"
	"net/http"
)

/*

 */
// 查询今天的课程
func V1AdminLessons(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte){
	CrossOrigin(w)
// 跨域时浏览器会先发送一个预检请求
	if r.Method == "OPTIONS" {
		return
	}
// 待查询课程的起始时间
	start := r.URL.Query().Get("start")
	if len(start) == 0 {
		http.NotFound(w, r)
		return
	}
// 待查询课程的结束时间
	end := r.URL.Query().Get("end")
	if len(end) == 0 {
		http.NotFound(w, r)
		return
	}
// 验证管理员权限
	if !validToken(db, w, r, secret){
		return
	}
	QueryJSON(w, db, "select * from v1_admin_lessons($1,$2,5)", start, end)
}
