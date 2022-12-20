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
    const dir = `C:\\Users\\Administrator\\WeChatProjects\\yg\\miniprogram\\pages\\booking`;

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
  
  if (str.indexOf('</html>') !== -1 ||str.indexOf('</view>') !== -1 ) {
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

function onF1Pressed(textarea) {

}

function onF2Pressed(textarea) {

}

function onF3Pressed(textarea) {
}

function onF4Pressed(textarea) {
  translationFunction(textarea)
}

function onF5Pressed(textarea) {

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

