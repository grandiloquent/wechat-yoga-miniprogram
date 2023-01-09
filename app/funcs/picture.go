package funcs

import (
	"database/sql"
	"fmt"
	"image"
	"image/jpeg"
	"image/png"
	"net/http"
	"os"
	"path"
	"strings"

	"github.com/nfnt/resize"
)

func Picture(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
	switch r.Method {
	case "GET":
		pictureGet(db, w, r, secret)
		return
	case "DELETE":
		pictureDelete(db, w, r, secret)
		return
	case "POST":
		picturePost(db, w, r, secret)
		return
	case "OPTIONS":
		pictureOptions(db, w, r, secret)
		return
	case "PUT":
		picturePut(db, w, r, secret)
		return
	}
}
func pictureGet(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
	switch r.URL.Query().Get("action") {
	case "1":
		break
	case "2":
		break
	default:
		break
	}

}
func pictureDelete(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
}
func picturePost(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	_ = r.ParseMultipartForm(32 << 20) // 32MB is the default used by FormFile
	fhs := r.MultipartForm.File["images"]
	for _, fh := range fhs {
		f, err := fh.Open()
		// f is one of the files
		if err != nil {
			fmt.Println(err)
			http.NotFound(w, r)
			return
		}
		var originalImage image.Image
		if strings.HasSuffix(fh.Filename, ".png") {
			originalImage, err = png.Decode(f)
		} else if strings.HasSuffix(fh.Filename, ".jpg") {
			originalImage, err = jpeg.Decode(f)
		} else {
			originalImage, _, err = image.Decode(f)
		}
		if err != nil {
			http.NotFound(w, r)
			return
		}
		var m image.Image
		//fmt.Println(originalImage.Bounds().Dx())
		if originalImage.Bounds().Dx() > 1800 {
			m = resize.Resize(1800, 0, originalImage, resize.Lanczos3)
		} else {
			m = originalImage
		}
		_ = os.MkdirAll("static/images", 0644)
		fileName := fmt.Sprintf("%s-%s-W%dH%d%s", getDateTimeString(), randomString(6), m.Bounds().Dx(), m.Bounds().Dy(), path.Ext(fh.Filename))
		fullName := fmt.Sprintf("static/images/%s", fileName)
		for fileExists(fullName) {
			fileName = fmt.Sprintf("%s-%s-W%dH%d%s", getDateTimeString(), randomString(6), m.Bounds().Dx(), m.Bounds().Dy(), path.Ext(fh.Filename))
			fullName = fmt.Sprintf("static/images/%s", fileName)
		}
		output, err := os.Create(fullName)
		if err != nil {
			http.NotFound(w, r)
			return
		}
		if strings.HasSuffix(fh.Filename, ".png") {
			err = png.Encode(output, m)
			if err != nil {
				_ = output.Close()
				http.NotFound(w, r)
				return
			}
			// if strings.HasSuffix(fh.Filename, ".jpg")
		} else {
			err = jpeg.Encode(output, m, nil)
			if err != nil {
				_ = output.Close()
				http.NotFound(w, r)
				return
			}
		}
		_ = output.Close()
		_, _ = w.Write([]byte(fileName))
	}
}
func pictureOptions(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
}
func picturePut(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
}
