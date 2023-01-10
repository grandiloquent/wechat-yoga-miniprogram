package funcs

import (
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

func Picture(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		pictureGet(w, r)
		return
	case "DELETE":
		pictureDelete(w, r)
		return
	case "POST":
		picturePost(w, r)
		return
	case "OPTIONS":
		pictureOptions(w, r)
		return
	case "PUT":
		picturePut(w, r)
		return
	}
}
func pictureGet(w http.ResponseWriter, r *http.Request) {
	switch r.URL.Query().Get("action") {
	case "1":
		break
	case "2":
		break
	default:
		break
	}

}
func pictureDelete(w http.ResponseWriter, r *http.Request) {
}
func picturePost(w http.ResponseWriter, r *http.Request) {
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
func pictureOptions(w http.ResponseWriter, r *http.Request) {
}
func picturePut(w http.ResponseWriter, r *http.Request) {
}
