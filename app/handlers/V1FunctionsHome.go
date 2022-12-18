package handlers

import (
	"database/sql"
	"net/http"
)

func V1FunctionsHome(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	QueryJSON(w, db, "select * from v1_functions_home()")
}
