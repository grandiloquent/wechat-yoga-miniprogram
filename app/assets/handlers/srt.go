package handlers

import (
	"bufio"
	"bytes"
	"errors"
	"fmt"
	"io"
	"strings"

	"golang.org/x/net/html"
)

func SrtScanner(data []byte, atEOF bool) (advance int, token []byte, err error) {
	for i := 0; i < len(data); i++ {
		if i < len(data)-1 && string(data[i:i+2]) == "\n\n" {
			return i + 2, data[:i+2], nil
		}
		if i < len(data)-3 && string(data[i:i+4]) == "\r\n\r\n" {
			return i + 4, data[:i+4], nil
		}
	}
	if atEOF && len(data) != 0 {
		return len(data), data, nil
	}
	// Golang v1.6
	// There is one final token to be delivered, which may be the empty string.
	// Returning bufio.ErrFinalToken here tells Scan there are no more tokens after this
	// but does not trigger an error to be returned from Scan itself.
	//return 0, data, fmt.Errorf("bufio.ErrFinalToken")
	return 0, nil, nil
}

func ConvertTimeToWebVtt(t string) (string, error) {
	t = strings.Replace(t, ",", ".", -1)
	timing := strings.Split(t, " --> ")
	for i, v := range timing {
		if len(v) < 3 {
			return "", errors.New("Invalid time line")
		}
		if v[:3] == "00:" {
			timing[i] = v[3:]
		}
	}
	return strings.Join(timing, " --> "), nil
}

func SrtToWebVtt(l string) (string, error) {
	l = strings.Replace(l, "\r\n", "\n", -1)
	lines := strings.SplitN(l, "\n", 3)
	if len(lines) < 2 {
		return "", errors.New("Invalid line format")
	}
	var err error
	lines = lines[1:]
	lines[0], err = ConvertTimeToWebVtt(lines[0])
	if err != nil {
		return "", err
	}
	lines[1], err = cleanTags(lines[1])
	if err != nil {
		return lines[1], err
	}
	return fmt.Sprintf("%s\n%s", lines[0], lines[1]), nil
}

// cleanTags replaces invalid tags with <b> and encodes characters such &
// into html entities (e.g. &amp;) to avoid conflicts with VTT annotations.
// TODO: Parse font tags and replace them with Cue STYLE annotations.
func cleanTags(s string) (string, error) {
	// https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API#Cue_payload_text_tags
	// Only the following tags are the HTML tags allowed in a cue
	// and require opening and closing tags.
	// Class tag (<c></c>)
	// Italics tag (<i></i>)
	// Bold tag (<b></b>)
	// Underline tag (<u></u>)
	// Ruby tag (<ruby></ruby>)
	// Ruby text tag (<rt></rt>)
	// Voice tag (<v></v>)
	// Lang
	doc, err := html.Parse(strings.NewReader(s))
	if err != nil {
		return "", errors.New("cleanTags-0: " + err.Error())
	}
	var f func(*html.Node)
	f = func(n *html.Node) {
		switch n.Type {
		case html.ElementNode:
			switch n.Data {
			case "html", "head", "body":
				// These are injected automatically by the html package.
				// We remove them before return
			case "b", "c", "i", "ruby", "rt", "<u>":
				// Only <v> and <lang> can have an annotation.
				n.Attr = nil
			case "v", "lang":
			default:
				// if the tag is not allowed it is converted to "<b>"
				n.Data = "b"
				n.Attr = nil
			}
		case html.TextNode:
			// html.Render already escapes the text nodes
			//n.Data = template.HTMLEscapeString(n.Data)
		}
		for c := n.FirstChild; c != nil; c = c.NextSibling {
			f(c)
		}
	}
	f(doc)
	buf := bytes.NewBuffer(nil)
	if err = html.Render(buf, doc); err != nil {
		return "", err
	}
	bs := strings.TrimPrefix(buf.String(), "<html><head></head><body>")
	bs = strings.TrimSuffix(bs, "</body></html>")
	return bs, nil
}

type Reader struct {
	s *bufio.Scanner
	b bytes.Buffer
	p int64
}

func NewReader(reader io.Reader) (*Reader, error) {
	r := new(Reader)
	r.p = 0
	r.s = bufio.NewScanner(reader)
	r.s.Split(SrtScanner)
	return r, nil
}

type Err struct {
	Err []error
}

func (e *Err) Error() string {
	var s string
	for k := range e.Err {
		s += fmt.Sprintf("%#v\n", e.Err[k].Error())
	}
	return s
}

// WriteTo writes data to w until the buffer is drained
// Any error encountered during the write is also returned.
// Scanning errors are returned into an error of type Err
func (r *Reader) WriteTo(w io.Writer) (n int, err error) {
	n, err = w.Write([]byte("WEBVTT\n\n"))
	if err != nil {
		return
	}
	var e Err
	for r.s.Scan() {
		l := r.s.Text()
		l, err = SrtToWebVtt(l)
		if err != nil {
			e.Err = append(e.Err, err)
			// skip line.
			continue
		}
		var i int
		i, err = w.Write([]byte(l))
		if err != nil {
			return n, err
		}
		n += i
	}
	if e.Err != nil {
		if r.s.Err() != nil {
			e.Err = append(e.Err, r.s.Err())
		}
		return n, &e
	}
	return n, r.s.Err()
}

func (r *Reader) Read(p []byte) (n int, e error) {
	var buf bytes.Buffer
	if r.p == 0 {
		buf.WriteString("WEBVTT\n\n")
	} else {
		buf.Write(r.b.Bytes())
		r.b.Reset()
	}

	for buf.Len() < len(p) && r.s.Scan() {
		l := r.s.Text()
		l, e = SrtToWebVtt(l)
		if e != nil {
			return 0, e
		}
		buf.WriteString(l)
	}

	/*if err := scanner.Err(); err != nil {
		fmt.Printf("Invalid input: %s", err)
	}*/

	n = copy(p, buf.Bytes())
	r.p = r.p + int64(n)
	r.b.Write(buf.Bytes()[n:])
	if n == 0 {
		return n, io.EOF
	}
	return n, nil
}
