package handlers

import (
	"database/sql"
	"io/ioutil"
	"net/http"
)

func SQLHandler(w http.ResponseWriter, r *http.Request, db *sql.DB) {

	buf, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.NotFound(w, nil)
		return
	}
	row := db.QueryRow(string(buf))
	if row.Err() != nil {
		w.WriteHeader(500)
		w.Write([]byte(row.Err().Error()))
		return
	}
	err = row.Scan(&buf)
	if err != nil {
		w.WriteHeader(500)
		w.Write([]byte(row.Err().Error()))
		return
	}
	w.Write(buf)
}
