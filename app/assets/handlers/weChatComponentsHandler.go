package handlers

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"path"
	"regexp"
	"strings"
)

func WeChatComponentsHandler(w http.ResponseWriter, r *http.Request) {
	src := `C:\Users\Administrator\WeChatProjects\yg\miniprogram\components`
	dst := r.URL.Query().Get("dst")
	dir := r.URL.Query().Get("dir")
	d := path.Join(src, dst)
	CreateDirectoryIfNotExists(d)
	f := path.Join(d, dst+".js")
	name := dst
	NameName := ToCamel(dst)
	if !CheckFileExists(f) {
		ioutil.WriteFile(f, []byte(regexp.MustCompile("\\$\\{[a-zA-Z ]+}").ReplaceAllStringFunc(`// https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/
// "${name}":"../../components/${name}/${name}"
// <${name} app="{{app}}"></${name}>


const utils = require('../../utils');

Component({
options: {
    styleIsolation: 'isolated'
  },
  properties: {
    items: {
      type: Array,
    },
    app:Object
  },
  data: {
  },
   lifetimes: {
    async attached() {
     
    },
    detached: function () {
    },
  },
 observers: {
     'items': function (items) {
       this.setData({
         notices: items.map(x => {
           x.timeago = utils.timeago(x.updated_time)
           return x;
         })
       })
     },
   },
  methods: {
   onClick(evt){
      this.triggerEvent('submit')
    }
    /*
   bindtap="navigate"
   navigate(evt) {
         this.triggerEvent('submit', evt.currentTarget.dataset.id)
       }
    on${NameName}Submit(evt) {
        console.log(evt.detail)
      }
    */
  }
})
`, func(s string) string {
			if strings.Index(s, "name") != -1 {
				return name
			}
			if strings.Index(s, "NameName") != -1 {
				return NameName
			}
			return s
		})), 0644)
	}

	f = path.Join(d, dst+".json")
	if !CheckFileExists(f) {
		ioutil.WriteFile(f, []byte(`{
  "component": true
}`), 0644)
	}

	f = path.Join(d, dst+".wxml")
	if !CheckFileExists(f) {
		ioutil.WriteFile(f, []byte(`<view class="title"></view>
<view style="padding:26rpx 32rpx 32rpx" bindtap="onClick">
</view>`), 0644)
	}

	f = path.Join(d, dst+".wxss")
	if !CheckFileExists(f) {
		ioutil.WriteFile(f, []byte(`.title {
    color: #4d5156;
    display: flex;
    position: relative;
    padding: 32rpx 32rpx 24rpx;
    background-color: #fff;
    margin-top: 20rpx;
}`), 0644)
	}
	d = dir
	f = path.Join(d, d[strings.LastIndex(d, "\\")+1:]+".json")
	fmt.Println(f)
	buf, _ := ioutil.ReadFile(f)
	var obj map[string]interface{}
	json.Unmarshal(buf, &obj)
	pages := obj["usingComponents"].(map[string]interface{})

	pages[dst] = fmt.Sprintf(`../../components/%s/%s`, dst, dst)
	obj["usingComponents"] = pages
	buf, _ = json.MarshalIndent(obj, "", "\t")
	ioutil.WriteFile(f, buf, 0644)

	f = path.Join(d, d[strings.LastIndex(d, "\\")+1:]+".wxml")
	buf, _ = ioutil.ReadFile(f)
	buf = append(buf, []byte("\n")...)
	buf = append(buf, []byte(fmt.Sprintf("<%s app=\"{{app}}\" bind:submit=\"on%sSubmit\"></%s>", dst, NameName, dst))...)
	ioutil.WriteFile(f, buf, 0644)
	f = path.Join(d, d[strings.LastIndex(d, "\\")+1:]+".js")
	buf, _ = ioutil.ReadFile(f)
	buf = append(buf, []byte("\n")...)
	buf = append(buf, []byte(fmt.Sprintf(`on%sSubmit(evt) {
        console.log(evt.detail)
      }`, NameName))...)
	ioutil.WriteFile(f, buf, 0644)
}
