package funcs

import (
	"database/sql"
	"encoding/json"
	"io"
	"net/http"
)

func Debug(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
	switch r.Method {
	case "GET":
		debugGet(db, w, r, secret)
		return
	case "DELETE":
		debugDelete(db, w, r, secret)
		return
	case "POST":
		debugPost(db, w, r, secret)
		return
	}
}
func debugGet(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
	xforward := r.Header.Get("X-Forwarded-For")
	buf, err := io.ReadAll(r.Body)
	if checkError(w, err) {
		return
	}
	if len(buf) == 0 {
		http.NotFound(w, r)
		return
	}
	var data interface{}
	err = json.Unmarshal(buf, &data)
	if checkError(w, err) {
		return
	}
	buf, err = queryRow(db, "select * from v1_debug($1,$2)", string(buf), xforward)
	if checkError(w, err) {
		return
	}
	w.Header().Set("Content-Type", "text/plain; charset=utf-8")
	w.Write(buf)
}
func debugDelete(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
}
func debugPost(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
}
