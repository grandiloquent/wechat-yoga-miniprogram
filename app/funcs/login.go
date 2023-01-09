package funcs

import (
	"database/sql"
	"net/http"
)

func Login(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
	crossOrigin(w)

	switch r.Method {
	case "GET":
		loginGet(db, w, r, secret)
		return
	case "DELETE":
		loginDelete(db, w, r, secret)
		return
	case "POST":
		loginPost(db, w, r, secret)
		return
	case "OPTIONS":
		loginOptions(db, w, r, secret)
		return
	case "PUT":
		loginPut(db, w, r, secret)
		return
	}
}
func loginGet(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
	switch r.URL.Query().Get("action") {
	case "1":
		break
	case "2":
		break
	default:
		if !ValidToken(db, w, r, secret) {
			return
		}
		break
	}

}
func loginDelete(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
}
func loginPost(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
	phoneNumber := r.FormValue("phone_number")
	password := r.FormValue("password")
	row := db.QueryRow("select * from check_user_password($1,$2)", phoneNumber, password)
	if checkError(w, row.Err()) {
		return
	}
	var id sql.NullString
	err := row.Scan(&id)
	if checkError(w, err) {
		return
	}
	if !id.Valid {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	buf, err := createToken(secret, id.String)
	if checkError(w, err) {
		return
	}
	w.Header().Set("Content-Type", "application/jwt")
	w.Write(buf)
}
func loginOptions(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
}
func loginPut(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
}
