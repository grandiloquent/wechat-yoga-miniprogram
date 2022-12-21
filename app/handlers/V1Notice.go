package handlers

import (
	"database/sql"
	"net/http"
)
/*

*/
func V1Notice(db *sql.DB, w http.ResponseWriter, r *http.Request) {
id := r.URL.Query().Get("id")
	if len(id) == 0 {
		http.NotFound(w, r)
    return
	}
	QueryJSON(w, db, "select * from v1_notice($1)",id)
}

