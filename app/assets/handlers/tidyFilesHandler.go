package handlers

import (
	"net/http"
	"os"
	"path"
	"path/filepath"
	"strings"
)

func TidyFilesHandler(w http.ResponseWriter, r *http.Request) {

	p := r.URL.Query().Get("path")
	if len(p) == 0 {
		http.NotFound(w, nil)
		return
	}
	err := tidyFiles(p)
	if err != nil {
		return
	}
}
func tidyFiles(p string) error {
	fs, err := os.ReadDir(p)
	if err != nil {
		return err
	}
	for _, f := range fs {
		if !f.IsDir() {
			ext := filepath.Ext(f.Name())
			if len(ext) == 0 {
				ext = ".unknown"
			}
			ext = strings.ToUpper(ext)
			ext = path.Join(p, ext)
			err := CreateDirectoryIfNotExists(ext)
			if err != nil {
				return err
			}
			err = os.Rename(path.Join(p, f.Name()), path.Join(ext, f.Name()))
			if err != nil {
				return err
			}
		}
	}
	return nil
}
