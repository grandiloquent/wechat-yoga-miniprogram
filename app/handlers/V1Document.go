package handlers

import (
	"database/sql"
	"io/ioutil"
	"net/http"
)

func V1Document(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	CrossOrigin(w)
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
