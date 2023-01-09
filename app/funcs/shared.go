package funcs

import (
	"crypto/hmac"
	"crypto/sha256"
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"math/rand"
	"net/http"
	"os"
	"strings"
	"time"
)

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

func randomString(length int) string {
	return StringWithCharset(length, charset)
}

func getId(w http.ResponseWriter, r *http.Request) string {
	return getInt("id", w, r)
}
func getInt(key string, w http.ResponseWriter, r *http.Request) string {
	id := r.URL.Query().Get(key)
	j := len(id)
	if j == 0 {
		http.Error(w, "Bad Id", http.StatusBadRequest)
		return ""
	}
	for i := 0; i < j; i++ {
		if id[i] > 57 || id[i] < 48 {
			http.Error(w, "Bad Id", http.StatusBadRequest)
			return ""
		}
	}
	return id
}
func insertNumber(db *sql.DB, w http.ResponseWriter, r *http.Request, query string) {
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
	buf, err = queryRow(db, query, string(buf))
	if checkError(w, err) {
		return
	}
	w.Header().Set("Content-Type", "text/plain; charset=utf-8")
	w.Write(buf)
}
func queryRow(db *sql.DB, query string, args ...any) ([]byte, error) {
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

func checkError(w http.ResponseWriter, err error) bool {
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
func queryInt(w http.ResponseWriter, db *sql.DB, query string, args ...any) {
	row := db.QueryRow(query, args...)
	if checkError(w, row.Err()) {
		return
	}
	// 读取返回的JSON字节数据
	var buf sql.NullInt32
	err := row.Scan(&buf)
	if checkError(w, err) {
		return
	}
	if buf.Valid {
		w.Write([]byte(fmt.Sprintf("%d", buf.Int32)))
	} else {
		http.NotFound(w, nil)
	}
}
func queryJSON(w http.ResponseWriter, db *sql.DB, query string, args ...any) {
	buf, err := queryRow(db, query, args...)
	// 如果查询错误，则返回500状态码和发生错误的原因。但暴露过多信息，可能会影响服务器的安全性，在服务器稳定后，应该仅返回无意义的错误提示
	if checkError(w, err) {
		return
	}
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Write(buf)
}
func crossOrigin(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "*")
	w.Header().Set("Access-Control-Allow-Headers", "authorization")
}
func ValidToken(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) bool {
	token := r.Header.Get("Authorization")
	userinfo, err := decodeToken(token, secret)
	if !checkUserInfo(userinfo) {
		w.WriteHeader(http.StatusForbidden)
		return false
	}
	if checkError(w, err) {
		return false
	}
	return true
}
func decodeToken(token string, secret []byte) (string, error) {
	if len(token) == 0 {
		return "", fmt.Errorf("%s", "Invalid Token")
	}
	pieces := strings.Split(token, "|")
	if len(pieces) < 2 {
		return "", fmt.Errorf("%s", "Invalid Token")
	}
	b, err := hmacSha256(secret, pieces[1])
	if err != nil {
		return "", err
	}
	if base64.StdEncoding.EncodeToString(b) != pieces[0] {
		return "", fmt.Errorf("%s", "Invalid Token")
	}
	return pieces[1], nil
}
func hmacSha256(key []byte, data string) ([]byte, error) {
	h := hmac.New(sha256.New, key)
	if _, err := h.Write([]byte(data)); err != nil {
		return nil, err
	}
	return h.Sum(nil), nil
}
func checkUserInfo(userinfo string) bool {
	return true
}
func fileExists(name string) bool {
	_, err := os.Stat(name)
	if err == nil {
		return true
	}
	if errors.Is(err, os.ErrNotExist) {
		return false
	}
	return false

}
func getDateTimeString() string {
	now := time.Now()
	return fmt.Sprintf("%d%02d%02d-%02d%02d%02d", now.Year(), now.Month(), now.Day(), now.Hour(), now.Minute(), now.Second())
}
func createToken(secret []byte, id string) ([]byte, error) {
	s := fmt.Sprintf("%s-%d", id, time.Now().Unix())
	buf, err := hmacSha256(secret, s)
	if err != nil {
		return nil, err
	}
	dst := make([]byte, base64.StdEncoding.EncodedLen(len(buf)))
	base64.StdEncoding.Encode(dst, buf)
	dst = append(dst, []byte("|")...)
	dst = append(dst, []byte(s)...)
	return dst, nil
}
