package funcs

import (
	"database/sql"
	"io/ioutil"
	"net/http"
)

func Document(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
	switch r.Method {
	case "GET":
		documentGet(db, w, r, secret)
		return
	case "DELETE":
		documentDelete(db, w, r, secret)
		return
	case "POST":
		documentPost(db, w, r, secret)
		return
	}
}
func documentGet(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
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
func documentDelete(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
}
func documentPost(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
}
