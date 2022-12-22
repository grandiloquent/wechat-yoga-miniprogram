package handlers

import (
	"database/sql"
	"net/http"
)

/*
 预约课程规则：

1. 用户类型 -1 的用户为异常用户，禁止预约课程
2. 开课前3小时以内，禁止用户取消已预约课程
3. 开课前1小时以内，禁止预约该课程
4. 预约人数满额后的预约视为候补，应按照先约先递补的原则，用短信或其他方式进行通知
5. 执行定时任务在开课前1小时内检查预约人数，不满  3 人自动取消课程
6. 管理员主动停止课程应通知用户

*/
func V1Book(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	openId := r.URL.Query().Get("openId")
	if len(openId) == 0 {
		http.NotFound(w, r)
		return
	}
	id := r.URL.Query().Get("id")
	if len(id) == 0 {
		http.NotFound(w, r)
		return
	}
	QueryJSON(w, db, "select * from v1_book($1,$2)",  id,openId)
}
