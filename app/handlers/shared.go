package handlers

import (
	"crypto/hmac"
	"crypto/sha256"
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"math/rand"
	"net/http"
	"strings"
	"time"
)

func QueryJSON(w http.ResponseWriter, db *sql.DB, query string, args ...any) {
	buf, err := QueryRow(db, query, args...)
	// 如果查询错误，则返回500状态码和发生错误的原因。但暴露过多信息，可能会影响服务器的安全性，在服务器稳定后，应该仅返回无意义的错误提示
	if CheckError(w, err) {
		return
	}
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Write(buf)
}

func CheckError(w http.ResponseWriter, err error) bool {
	if err != nil {
		w.Header().Set("Content-Type", "text/plain; charset=utf-8")
		// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
		w.Header().Set("X-Content-Type-Options", "nosniff")
		// https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status
		w.WriteHeader(500)
		fmt.Fprintln(w, err)
		return true
	}
	return false
}

// 执行数据库服务端返回JSON的函数
// 例如 select * from f($1)，函数查询参数以美元符号加以1开头的递增序列表示
func QueryRow(db *sql.DB, query string, args ...any) ([]byte, error) {
	row := db.QueryRow(query, args...)
	if row.Err() != nil {
		return nil, row.Err()
	}
	// 读取返回的JSON字节数据
	var buf []byte
	err := row.Scan(&buf)
	if err != nil {
		return nil, err
	}
	return buf, nil
}
func InsertNumber(db *sql.DB, w http.ResponseWriter, r *http.Request, query string) {
	buf, err := io.ReadAll(r.Body)
	if CheckError(w, err) {
		return
	}
	if len(buf) == 0 {
		http.NotFound(w, r)
		return
	}
	var data interface{}
	err = json.Unmarshal(buf, &data)
	if CheckError(w, err) {
		return
	}
	buf, err = QueryRow(db, query, string(buf))
	if CheckError(w, err) {
		return
	}
	w.Header().Set("Content-Type", "text/plain; charset=utf-8")
	w.Write(buf)
}
func QueryInt(w http.ResponseWriter, db *sql.DB, query string, args ...any) {
	row := db.QueryRow(query, args...)
	if CheckError(w, row.Err()) {
		return
	}
	// 读取返回的JSON字节数据
	var buf sql.NullInt32
	err := row.Scan(&buf)
	if CheckError(w, err) {
		return
	}
	if buf.Valid {
		w.Write([]byte(fmt.Sprintf("%d", buf.Int32)))
	} else {
		http.NotFound(w, nil)
	}
}
func writeError(w http.ResponseWriter, err error) {
	w.Header().Set("Content-Type", "text/plain; charset=utf-8")
	w.Header().Set("X-Content-Type-Options", "nosniff")
	w.WriteHeader(500)
	fmt.Fprintln(w, err)
}
func decodeToken(token string, secret []byte) (string, error) {
	if len(token) == 0 {
		return "", fmt.Errorf("%s", "Invalid Token")
	}
	pieces := strings.Split(token, "|")
	if len(pieces) < 2 {
		return "", fmt.Errorf("%s", "Invalid Token")
	}
	b, err := HmacSha256(secret, pieces[1])
	if err != nil {
		return "", err
	}
	if base64.StdEncoding.EncodeToString(b) != pieces[0] {
		return "", fmt.Errorf("%s", "Invalid Token")
	}
	return pieces[1], nil
}
func checkUserInfo(userinfo string) bool {
	return true
}
func validToken(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) bool {
	token := r.Header.Get("Authorization")
	userinfo, err := decodeToken(token, secret)
	if !checkUserInfo(userinfo) {
		w.WriteHeader(http.StatusForbidden)
		return false
	}
	if CheckError(w, err) {
		return false
	}
	return true
}

func GetDateTimeString() string {
	now := time.Now()
	return fmt.Sprintf("%d%02d%02d-%02d%02d%02d", now.Year(), now.Month(), now.Day(), now.Hour(), now.Minute(), now.Second())
}

const charset = "abcdefghijklmnopqrstuvwxyz" +
	"ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

var seededRand *rand.Rand = rand.New(
	rand.NewSource(time.Now().UnixNano()))

func StringWithCharset(length int, charset string) string {
	b := make([]byte, length)
	for i := range b {
		b[i] = charset[seededRand.Intn(len(charset))]
	}
	return string(b)
}

func String(length int) string {
	return StringWithCharset(length, charset)
}
func HmacSha256(key []byte, data string) ([]byte, error) {
	h := hmac.New(sha256.New, key)
	if _, err := h.Write([]byte(data)); err != nil {
		return nil, err
	}
	return h.Sum(nil), nil
}
func CrossOrigin(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "*")
	w.Header().Set("Access-Control-Allow-Headers", "authorization")
}

var Secret = []byte{161, 219, 25, 253, 28, 70, 147, 43, 68, 17, 168, 75, 89, 233, 117, 116, 224, 230, 127, 165, 60, 187, 219, 70, 136, 54, 148, 244, 27, 121, 235, 73}
