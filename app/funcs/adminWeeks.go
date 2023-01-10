package funcs

import (
	"database/sql"
	"net/http"
)

func AdminWeeks(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	switch r.Method {
	case "GET":
		queryJSON(w, db, "select * from v1_admin_weeks()")
		break
	// case "POST":
	// 	InsertNumber(db, w, r, "select * from v1_admin_()")
	// 	break
	default:
		http.NotFound(w, r)
		break
	}

}
