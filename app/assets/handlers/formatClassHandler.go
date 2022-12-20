package handlers

import (
	"io/ioutil"
	"net/http"
	"path"
	"strings"
)

func FormatClassHandlerr(w http.ResponseWriter, r *http.Request) {
	filename := r.URL.Query().Get("path")
	dir := path.Dir(filename)
	n := path.Base(filename)[:strings.LastIndex(path.Base(filename), ".")]
	filename = path.Join(dir, n+".wxss")
	if CheckFileExists(filename) {
		bv, _ := ioutil.ReadAll(r.Body)
		buf, _ := ioutil.ReadFile(filename)
		buf = append(buf, []byte("\n")...)
		buf = append(buf, bv...)
		ioutil.WriteFile(filename, buf, 0644)
	}
	filename = path.Join(dir, n+".css")
	if CheckFileExists(filename) {
		bv, _ := ioutil.ReadAll(r.Body)
		buf, _ := ioutil.ReadFile(filename)
		buf = append(buf, []byte("\n")...)
		buf = append(buf, bv...)
		ioutil.WriteFile(filename, buf, 0644)
	}
}
