package handlers

import (
	"fmt"
	"net/http"
	"os"
	"path"
)

func RenameFileHandler(w http.ResponseWriter, r *http.Request) {

	src := r.URL.Query().Get("src")
	if _, err := os.Stat(src); os.IsNotExist(err) {
		w.Header().Set("Content-Type", "text/plain; charset=utf-8")
		w.WriteHeader(404)
		fmt.Fprintf(w, "%s", src)
		return
	}
	dst := r.URL.Query().Get("dst")
	parent := path.Dir(src)
	dst = path.Join(parent, dst)
	if _, err := os.Stat(dst); os.IsNotExist(err) {
		os.Rename(src, dst)
		w.Write([]byte("Success"))
		return
	}
	w.Header().Set("Content-Type", "text/plain; charset=utf-8")
	w.WriteHeader(404)
	fmt.Fprintf(w, "%s", src)
}
