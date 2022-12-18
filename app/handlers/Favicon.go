package handlers

import (
	"database/sql"
	"net/http"
)

func Favicon(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	http.NotFound(w, r)
}
