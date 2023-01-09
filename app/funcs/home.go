package funcs

import (
	"database/sql"
	"net/http"
)

func Home(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
	http.ServeFile(w, r, "./static/index.html")
}
