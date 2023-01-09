package funcs

import (
	"database/sql"
	"net/http"
)

func AdminWeeks(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
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
