package handlers

import (
	"database/sql"
	"encoding/base64"
	"fmt"
	"net/http"
	"time"
)

// 使用通过环境变量传入键
func createToken(secret []byte, id string) ([]byte, error) {
	s := fmt.Sprintf("%s-%d", id, time.Now().Unix())
	buf, err := HmacSha256(secret, s)
	if err != nil {
		return nil, err
	}
	dst := make([]byte, base64.StdEncoding.EncodedLen(len(buf)))
	base64.StdEncoding.Encode(dst, buf)
	dst = append(dst, []byte("|")...)
	dst = append(dst, []byte(s)...)
	return dst, nil
}

// 管理员登录
func V1Login(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
	CrossOrigin(w)
	if r.Method != "POST" {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
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
	//p := strings.Split(s, "|")
	//b, _ := HmacSha256(secret, p[1])
	//fmt.Println(base64.StdEncoding.EncodeToString(b))
	//w.Write(buf)
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
