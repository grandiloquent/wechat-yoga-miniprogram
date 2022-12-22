package handlers

import (
	"database/sql"
	"net/http"
)

/*

 */
func V1BookedQuery(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	openId := r.URL.Query().Get("openId")
	if len(openId) == 0 {
		http.NotFound(w, r)
		return
	}

	startTime := r.URL.Query().Get("startTime")
	if len(startTime) == 0 {
		http.NotFound(w, r)
		return
	}
	endTime := r.URL.Query().Get("endTime")
	if len(endTime) == 0 {
		http.NotFound(w, r)
		return
	}
	QueryJSON(w, db, "select * from v1_booked_query($1,$2,$3)", openId, startTime, endTime)
}
