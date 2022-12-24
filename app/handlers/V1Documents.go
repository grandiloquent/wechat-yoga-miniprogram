package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
)

func V1Documents(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	CrossOrigin(w)
	files, err := ioutil.ReadDir("./frontend")
	if err != nil {
		fmt.Print(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	var array []string
	for i := 0; i < len(files); i++ {
		if !files[i].IsDir() && strings.HasSuffix(files[i].Name(), ".md") {
			array = append(array, files[i].Name())
		}
	}
	buf, err := json.Marshal(array)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Write(buf)
}
