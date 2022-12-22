package handlers

import (
	"database/sql"
	"encoding/base64"
	"net/http"
)

// 管理员登录
func V1AdminLogin(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
	CrossOrigin(w)
	if r.Method == "OPTIONS" {
		return
	}
	if r.Method != "POST" && r.Method != "GET" {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	if r.Method == "POST" {
		phoneNumber := r.FormValue("phone_number")
		password := r.FormValue("password")
		row := db.QueryRow("select * from check_user_password($1,$2)", phoneNumber, password)
		if CheckError(w, row.Err()) {
			return
		}

		var id sql.NullString
		err := row.Scan(&id)
		if CheckError(w, err) {
			return
		}
		if !id.Valid {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		buf, err := createToken(secret, id.String)
		if CheckError(w, err) {
			return
		}
		w.Header().Set("Content-Type", "application/jwt")
		w.Write(buf)
	} else {
		if !validToken(db, w, r, secret) {
			return
		}
	}

}
func validCookie(db *sql.DB, w http.ResponseWriter, r *http.Request) bool {
	id := CalculateToken(r)
	if len(id) > 0 {
		QueryJSON(w, db, "select * from _query_userinfo_profile($1)", id)
		return true
	}
	return false
}
func CalculateToken(r *http.Request) string {
	id, err := r.Cookie("Id")
	if err != nil {
		return ""
	}
	token, err := r.Cookie("Token")
	if err != nil {
		return ""
	}
	session, err := HmacSha256(Secret, id.Value)
	if err != nil {
		return ""
	}
	if token.Value == base64.StdEncoding.EncodeToString(session) {

		return id.Value
	}
	return ""
}
