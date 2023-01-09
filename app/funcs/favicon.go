package funcs

import (
	"database/sql"
	"net/http"
)

func Favicon(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
	http.NotFound(w, r)
}
