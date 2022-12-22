async function createNewFile(textarea, isDir) {
  const path = new URL(document.URL).searchParams.get('path');
  const src = encodeURIComponent(substringBeforeLast(path, "/"));
  const selectedString = getSelectedString(textarea).trim();
  const dst = encodeURIComponent(selectedString);
  try {
    const response = await fetch(`/api/${isDir ? 'newfolder' : 'newfile'}?src=${src}&dst=${dst}`);
    await response.text();
    document.getElementById('toast').setAttribute('message', '成功');
  } catch (error) {
    document.getElementById('toast').setAttribute('message', '错误');
  }
}
function getSelectedString(textarea) {
  return textarea.value.substring(
    textarea.selectionStart,
    textarea.selectionEnd
  );
}
function substringBeforeLast(string, delimiter, missingDelimiterValue) {
  const index = string.lastIndexOf(delimiter);
  if (index === -1) {
    return missingDelimiterValue || string;
  } else {
    return string.substring(0, index);
  }
}
async function weChatPage(textarea) {

  const selectedString = getSelectedString(textarea).trim();
  const dst = encodeURIComponent(selectedString);
  try {
    const response = await fetch(`/api/wechatpage?dst=${dst}`);
    await response.text();
    document.getElementById('toast').setAttribute('message', '成功');
  } catch (error) {
    document.getElementById('toast').setAttribute('message', '错误');
  }
}

async function createWeChatComponents(textarea) {
  const selectedString = getSelectedString(textarea).trim();
  const dst = encodeURIComponent(selectedString);
  try {
    // const dir=`C:\\Users\\Administrator\\WeChatProjects\\yg\\miniprogram\\pages\\user`;
    const dir = `C:\\Users\\Administrator\\WeChatProjects\\yg\\miniprogram\\pages\\one`;
// &dir=${encodeURIComponent(dir)}
// &src=${encodeURIComponent(`C:\\Users\\Administrator\\WeChatProjects\\yg`)}

    const response = await fetch(`/api/wechatcomponents?dst=${dst}&dir=${encodeURIComponent(dir)}`);
    await response.text();
    document.getElementById('toast').setAttribute('message', '成功');
  } catch (error) {
    document.getElementById('toast').setAttribute('message', '错误');
  }
}

function formattingJavaScript(textarea) {
  const options = { indent_size: 2, space_in_empty_paren: true }
  let str = textarea.value;
  let s;

  if (str.indexOf('</html>') !== -1 || str.indexOf('</view>') !== -1) {
    s = html_beautify(str, options);
  } else if (/\)\s+{/.test(str)) {
    s = js_beautify(str, options);
  } else {
    s = css_beautify(str, options);
  }
  //const s = str.indexOf('</html>')!==-1 ? : ;
  textarea.value = s;
}

function findExtendPosition(editor) {
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  let string = editor.value;
  let offsetStart = start;
  while (offsetStart > 0) {
    if (!/\s/.test(string[offsetStart - 1]))
      offsetStart--;
    else {
      let os = offsetStart;
      while (os > 0 && /\s/.test(string[os - 1])) {
        os--;
      }
      if ([...string.substring(offsetStart, os).matchAll(/\n/g)].length > 1) {
        break;
      }
      offsetStart = os;
    }
  }
  let offsetEnd = end;
  while (offsetEnd < string.length) {
    if (!/\s/.test(string[offsetEnd + 1])) {

      offsetEnd++;
    } else {

      let oe = offsetEnd;
      while (oe < string.length && /\s/.test(string[oe + 1])) {
        oe++;
      }
      if ([...string.substring(offsetEnd, oe + 1).matchAll(/\n/g)].length > 1) {
        offsetEnd++;

        break;
      }
      offsetEnd = oe + 1;

    }
  }
  while (offsetStart > 0 && string[offsetStart - 1] !== '\n') {
    offsetStart--;
  }
  // if (/\s/.test(string[offsetEnd])) {
  //     offsetEnd--;
  // }
  return [offsetStart, offsetEnd];
}
function upperCamel(string) {
  string = camel(string);
  return string.slice(0, 1).toUpperCase() + string.slice(1);
}
function camel(string) {
  return string.replaceAll(/[ _-]([a-zA-Z])/g, m => m[1].toUpperCase());
}
function snake(string) {
  return string.replaceAll(/(?<=[a-z])[A-Z]/g, m => `_${m}`).toLowerCase()
    .replaceAll(/[ -]([a-z])/g, m => `_${m[1]}`)
}
function substringAfter(string, delimiter, missingDelimiterValue) {
  const index = string.indexOf(delimiter);
  if (index === -1) {
    return missingDelimiterValue || string;
  } else {
    return string.substring(index + delimiter.length);
  }
}
function substringAfterLast(string, delimiter, missingDelimiterValue) {
  const index = string.lastIndexOf(delimiter);
  if (index === -1) {
    return missingDelimiterValue || string;
  } else {
    return string.substring(index + delimiter.length);
  }
}
function substringBefore(string, delimiter, missingDelimiterValue) {
  const index = string.indexOf(delimiter);
  if (index === -1) {
    return missingDelimiterValue || string;
  } else {
    return string.substring(0, index);
  }
}
async function translationFunction(textarea) {
  const s = getSelectedString(textarea);
  try {
    const response = await fetch(`http://kpkpkp.cn/api/trans?q=${encodeURIComponent(s)}&to=en`);
    const obj = await response.json();
    const n = camel(obj.sentences[0].trans);
    textarea.setRangeText(`${n[0].toLowerCase() + n.slice(1)}(){

    }`, textarea.selectionStart,
      textarea.selectionEnd)

  } catch (error) {
    console.log(error);
  }
}
function returnToParentDirectory() {
  const path = new URL(document.URL).searchParams.get('path');
  const uri = `/?path=${encodeURIComponent(substringBeforeLast(path, "/"))}&isDir=1`;
  console.log(uri)
  window.location.href = uri
}
async function createNormalHandler(textarea) {
  const selectedString = getSelectedString(textarea).trim();
  const dst = encodeURIComponent(selectedString);
  try {
    const response = await fetch(`/api/handler?dst=${dst}`);
    const res = await response.text();
    textarea.setRangeText(res, textarea.selectionStart,
      textarea.selectionEnd)
    document.getElementById('toast').setAttribute('message', '成功');
  } catch (error) {
    document.getElementById('toast').setAttribute('message', '错误');
  }
}
async function executeSQL(textarea) {
  let start = textarea.selectionStart;
  let end = start;
  while (start > -1) {
    if (textarea.value[start] === '*' && start - 1 > -1 && textarea.value[start - 1] === '/')
      break
    start--;
  }
  while (end + 1 < textarea.value.length) {
    if (textarea.value[end] === '*' && end + 1 < textarea.value.length && textarea.value[end + 1] === '/')
      break
    end++;
  }
  let dst = textarea.value.substring(start + 1, end).trim();
  try {
    const response = await fetch(`/api/sql`, {
      method: 'POST',
      headers: {
        "Content-Type": "text/plain"
      },
      body: dst
    });
    const res = await response.text();
    document.getElementById('toast').setAttribute('message', res);
  } catch (error) {
    document.getElementById('toast').setAttribute('message', '错误');
  }
}
function formatStyleForWeChat(strings) {
  const lines = strings.split(';').map(x => x.trim());
  const properties = lines.filter(x => x.startsWith('--')).map(x => {
    const pieces = x.split(':');
    if (pieces.length > 1)
      return {
        key: pieces[0].trim(),
        value: pieces[1].trim()
      }
  });
  const source = lines.filter(x => !x.startsWith('--'))
    .map(x => {

      return x.replace(/var\([^\)]+\)/g, m => {
        const key = /--[a-zA-Z0-9-]+/.exec(m)[0];
        const founded = properties.filter(x => x.key === key);
        const value = /,([^\)]+)\)/.exec(m);
        console.log(founded)
        return founded && founded.length ? founded[0]["value"] : ((value && value[1]) || '')
      });
    });
  const s = source.join(';').replaceAll(/[\d.]+px/g, m => {
    return parseFloat(m) * 2 + 'rpx'
  }).replaceAll(/font: \d+ \d+rpx\/\d+rpx[^;]+;/g, m => {
    const r = /font: (\d+) (\d+rpx)\/(\d+rpx)[^;]+;/.exec(m);
    return `font-weight: ${r[1]};font-size: ${r[2]};line-height: ${r[3]};`;
  });
  return substringAfter(s, "-webkit-tap-highlight-color: transparent;")
}

async function formatWeChatStyle(textarea) {
  let s;
  if (typeof NativeAndroid !== 'undefined') {
    s = NativeAndroid.readText()
  } else {
    s = await navigator.clipboard.readText()
  }
  s = formatStyleForWeChat(s);
  textarea.setRangeText(`<view style="${s}">
  </view>`, textarea.selectionStart, textarea.selectionEnd);
}
async function formatClass(textarea) {
  const path = new URL(document.URL).searchParams.get('path');
  const selectedString = getSelectedString(textarea);
  let k, ss;

  const match = /(<*?[a-zA-Z0-9_-]+) +(style="([^"]+)")/.exec(selectedString);
  k = match[1]
  ss = match[3];
  textarea.value = textarea.value.replace(match[0], `class="${k}"`)
    .replaceAll(match[2], `class="${k}"`);
  const dst = k.startsWith('<') ? `${k.slice(1)}{
      ${ss}
      }` : `.${k}{
      ${ss}
      }`;
  console.log(dst);
  try {
    const response = await fetch(`/api/formatclass?path=${path}`, {
      method: "POST",
      body: dst
    });
    await response.json();
    document.getElementById('toast').setAttribute('message', '成功');
  } catch (error) {
    document.getElementById('toast').setAttribute('message', '错误');
  }
}

function replaceSelectedText(textarea, s) {
  textarea.setRangeText(s, textarea.selectionStart, textarea.selectionEnd);
}
function replaceSelected(textarea) {
  const selectedString = getSelectedString(textarea).trim();
  const firstLine = substringBefore(selectedString, "\n").trim().split(' ');
  const content = substringAfter(selectedString, "\n").trim();
  replaceSelectedText(textarea, content.replaceAll(
    firstLine[0], firstLine[1]
  ))
}

function toBlocks(string) {
  let count = 0;
  let buf = [];
  const blocks = [];
  for (let i = 0; i < string.length; i++) {
    buf.push(string[i])
    if (string[i] === '{') {
      count++;
    } else if (string[i] === '}') {
      count--;
      if (count === 0) {
        blocks.push(buf.join(''))
        buf = [];
      }
    }
  }
  return blocks;
}

function sortFunctions(string) {
  return toBlocks(string.replaceAll(/{}/g, "<<<--->>>"))
    .sort((x, y) => {
      return substringAfterLast(substringBefore(x, '(').trim(), ' ').localeCompare(substringAfterLast(substringBefore(y, '(').trim(), ' '))
    }).join('').replaceAll(/<<<--->>>/g, "{}");
}
function sortFunction(textarea) {
  const selectedString = getSelectedString(textarea).trim();
  
  replaceSelectedText(textarea, sortFunctions(selectedString))
}

function encodeSVG(textarea){
  const selectedString = getSelectedString(textarea).trim();
  let s = selectedString
  .replace("<svg","<svg fill='rgb(25, 103, 210)' xmlns='http://www.w3.org/2000/svg' ")
  .replaceAll("\"", "'")
    .replaceAll(/[\r\n]+/g, '');
  replaceSelectedText(textarea, `
  background-size:36px 36px;
  background-position: center center;
            background-repeat: no-repeat;
            background-image:url("data:image/svg+xml;utf8,${s}");
  `)
}

function onF1Pressed(textarea) {
  replaceSelectedText(textarea,`console.log();`)
}
async function onF2Pressed(textarea) {
  await formatWeChatStyle(textarea);
}

function onF3Pressed(textarea) {
}

function onF4Pressed(textarea) {
  translationFunction(textarea)
}

function onF5Pressed(textarea) {
  formatClass(textarea)
}

function onF6Pressed(textarea) {
  formattingJavaScript(textarea);
}

function onF7Pressed(textarea) {
  returnToParentDirectory()
}

function onF8Pressed(textarea) {
  weChatPage(textarea)
}

function onF9Pressed(textarea) {
  createWeChatComponents(textarea)
}

function onF10Pressed(textarea) {

}

function onF11Pressed(textarea) {

}
function onKey0Pressed(textarea) {

}

function onKey1Pressed(textarea) {

}

function onKey2Pressed(textarea) {

}

function onKey3Pressed(textarea) {

}

function onKey4Pressed(textarea) {

}

function onKey5Pressed(textarea) {

}

function onKey6Pressed(textarea) {

}

function onKey7Pressed(textarea) {

}

function onKey8Pressed(textarea) {

}

function onKey9Pressed(textarea) {

}

