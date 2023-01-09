package funcs

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

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
