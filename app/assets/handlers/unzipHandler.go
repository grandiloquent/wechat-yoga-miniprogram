package handlers

import (
	"net/http"
	"strings"
)

func UnzipHandler(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	filename := q.Get("path")
	Unzip(filename, filename[:strings.LastIndex(filename, ".")])
}
