package handlers

import (
	"database/sql"
	"net/http"
)

/*

 */

func V1BookingQuery(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	openId := r.URL.Query().Get("openId")
	if len(openId) == 0 {
		http.NotFound(w, r)
		return
	}
	start := r.URL.Query().Get("start")
	if len(start) == 0 {
		http.NotFound(w, r)
		return
	}
	classType := r.URL.Query().Get("classType")
	if len(classType) == 0 {
		http.NotFound(w, r)
		return
	}
	QueryJSON(w, db, "select * from v1_booking_query($1,$2,$3)", start, openId, classType)
}
