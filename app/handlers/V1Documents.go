package handlers

import (
	"database/sql"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"strings"
)

func V1Documents(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	CrossOrigin(w)
	files, err := ioutil.ReadDir("./frontend")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	var array []map[string]interface{}
	for i := 0; i < len(files); i++ {
		if !files[i].IsDir() && strings.HasSuffix(files[i].Name(), ".md") {
			m := make(map[string]interface{})
			n := files[i].Name()
			m["name"] = n[:strings.LastIndex(n, ".")]
			m["time"] = files[i].ModTime().Unix()
			array = append(array, m)
		}
	}
	buf, err := json.Marshal(array)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Write(buf)
}
