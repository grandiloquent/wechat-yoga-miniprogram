package funcs

import (
	"database/sql"
	"encoding/json"
	"net/http"
)

func Sql(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	switch r.Method {
	case "GET":
		sqlGet(db, w, r)
		return
	case "DELETE":
		sqlDelete(db, w, r)
		return
	case "POST":
		sqlPost(db, w, r)
		return
	case "OPTIONS":
		sqlOptions(db, w, r)
		return

	}
}
func sqlGet(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	switch r.URL.Query().Get("action") {
	case "1":
		break
	case "2":
		break
	default:
		q := r.URL.Query().Get("q")
		if len(q) == 0 {
			http.NotFound(w, r)
			return
		}
		crossOrigin(w)

		// 验证权限
		// secret 是用于计算Hash的长度为32的字节数组
		if !ValidToken(db, w, r) {
			return
		}
		rows, err := db.Query(q)
		if checkError(w, err) {
			return
		}
		arrayResult := make([][]interface{}, 0)
		columns, _ := rows.Columns()
		colTypes, _ := rows.ColumnTypes()
		colCount := len(columns)
		for rows.Next() {
			rowTemplate := make([]interface{}, colCount)
			rowValues := make([]interface{}, colCount)
			for i := range colTypes {
				rowTemplate[i] = &rowValues[i]
			}
			err = rows.Scan(rowTemplate...)
			if checkError(w, err) {
				return
			}
			arrayResult = append(arrayResult, rowValues)
		}
		var buf []byte
		buf, err = json.Marshal(arrayResult)
		if checkError(w, err) {
			return
		}
		w.Write(buf)
		break
	}

}
func sqlDelete(db *sql.DB, w http.ResponseWriter, r *http.Request) {
}
func sqlPost(db *sql.DB, w http.ResponseWriter, r *http.Request) {
}
func sqlOptions(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	crossOrigin(w)
}
