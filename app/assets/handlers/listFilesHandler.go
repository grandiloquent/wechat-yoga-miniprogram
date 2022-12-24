package handlers

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"path"
	"strings"
)

func listDirectory(fullname string) ([]map[string]interface{}, error) {
	entries, err := os.ReadDir(fullname)
	if err != nil {
		return nil, err
	}
	var array []map[string]interface{}
	for i := 0; i < len(entries); i++ {
		obj := make(map[string]interface{})
		obj["parent"] = fullname
		obj["name"] = entries[i].Name()
		obj["isDir"] = entries[i].IsDir()
		f, _ := entries[i].Info()
		obj["length"] = f.Size()
		array = append(array, obj)
	}
	return array, nil
}
func ListFilesHandler(w http.ResponseWriter, r *http.Request) {
	p := r.URL.Query().Get("path")
	if len(p) == 0 {
		p = "C:/Users/Administrator/Desktop"
	}
	if r.URL.Query().Get("isDir") == "0" {
		if strings.HasSuffix(p, ".htm") {
			b, err := ioutil.ReadFile(p)
			if err != nil {
				http.NotFound(w, r)
			}
			r.Header.Set("Content-Type", "text/html")
			w.Write(b)
		} else if strings.HasSuffix(p, ".vtt") {
			p = strings.Replace(p, ".vtt", ".srt", 1)
			// b, err := ioutil.ReadFile(p)
			// if err != nil {
			// 	http.NotFound(w, r)
			// 	return true
			// }
			// vtt, err := SrtToWebVtt(string(b))
			// if err != nil {
			// 	http.NotFound(w, r)
			// 	return true
			// }
			// _ = vtt
			r.Header.Set("Content-Type", "text/vtt")
			f, err := os.Open(p)
			if err != nil {
				http.NotFound(w, r)
				return
			}
			defer f.Close()
			r, _ := NewReader(f)
			r.WriteTo(w)
			//w.Write([]byte("WEBVTT\n\n" + strings.Replace(vtt, "&gt;", ">", -1)))
		} else {
			w.Header().Set("Content-Disposition", fmt.Sprintf(`attachment; filename="%s"`, path.Base(p)))
			http.ServeFile(w, r, p)
		}
		return
	}
	data, err := listDirectory(p)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	writeJSON(w, data)

}
