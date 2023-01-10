package funcs

import (
	"database/sql"
	"io/ioutil"
	"net/http"
)

func Document(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	switch r.Method {
	case "GET":
		documentGet(db, w, r)
		return
	case "DELETE":
		documentDelete(db, w, r)
		return
	case "POST":
		documentPost(db, w, r)
		return
	}
}
func documentGet(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	crossOrigin(w)
	name := r.URL.Query().Get("name")
	if len(name) == 0 {
		http.NotFound(w, r)
		return
	}
	buf, err := ioutil.ReadFile("./frontend/" + name + ".md")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Write(buf)
}
func documentDelete(db *sql.DB, w http.ResponseWriter, r *http.Request) {
}
func documentPost(db *sql.DB, w http.ResponseWriter, r *http.Request) {
}
