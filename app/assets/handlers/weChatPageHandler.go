package handlers

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"path"
	"sort"
)

func WeChatPageHandler(w http.ResponseWriter, r *http.Request) {
	src := `C:\Users\Administrator\WeChatProjects\yg\miniprogram\pages`
	dst := r.URL.Query().Get("dst")
	d := path.Join(src, dst)
	CreateDirectoryIfNotExists(d)
	f := path.Join(d, dst+".js")
	if !CheckFileExists(f) {
		ioutil.WriteFile(f, []byte(fmt.Sprintf(`const utils = require('../../utils')
const app = getApp();

Page({
  data: {
    app
  },
  async onLoad() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    wx.setNavigationBarTitle({
      title: app.globalData.title
    })
    this.loadData();
  },
  navigate(e) {
    utils.navigate(e)
  },
  async loadData() {
    utils.getString(app, "api/", (err, data) => {
      if (err) return;
      this.setData({
        key: data
      });
    });
  }, onShareAppMessage() {
    return {
      title: app.globalData.title
    };
  },
})`)), 0644)
	}

	f = path.Join(d, dst+".json")
	if !CheckFileExists(f) {
		ioutil.WriteFile(f, []byte(fmt.Sprintf(`{
    "usingComponents": {
    },
     "navigationBarBackgroundColor": "#ffffff"
  }`)), 0644)
	}

	f = path.Join(d, dst+".wxml")
	if !CheckFileExists(f) {
		ioutil.WriteFile(f, []byte(fmt.Sprintf(``)), 0644)
	}

	f = path.Join(d, dst+".wxss")
	if !CheckFileExists(f) {
		ioutil.WriteFile(f, []byte(fmt.Sprintf(``)), 0644)
	}
	f = `C:\Users\Administrator\WeChatProjects\yg\miniprogram\app.json`
	buf, _ := ioutil.ReadFile(f)
	var obj map[string]interface{}
	json.Unmarshal(buf, &obj)
	pages := obj["pages"].([]interface{})

	pages = append(pages, fmt.Sprintf("pages/%s/%s", dst, dst))
	pagesString := make([]string, len(pages))
	for i, v := range pages {
		pagesString[i] = v.(string)
	}
	sort.StringsAreSorted(pagesString)
	obj["pages"] = pagesString
	buf, _ = json.MarshalIndent(obj, "", "\t")
	ioutil.WriteFile(f, buf, 0644)
}
