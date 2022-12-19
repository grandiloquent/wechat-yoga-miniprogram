package handlers

import (
	"io/ioutil"
	"net/http"
)

func SaveHandler(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	filename := q.Get("path")
	if len(filename) == 0 {
		http.NotFound(w, r)
		return
	}
	data, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	err = ioutil.WriteFile(filename, data, 0644)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	w.WriteHeader(200)
}
