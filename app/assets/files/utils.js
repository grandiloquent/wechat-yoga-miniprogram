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
    const response = await fetch(`/api/wechatcomponents?dst=${dst}&dir=${encodeURIComponent(`C:\\Users\\Administrator\\WeChatProjects\\yg\\miniprogram\\pages\\user`)}`);
    await response.text();
    document.getElementById('toast').setAttribute('message', '成功');
  } catch (error) {
    document.getElementById('toast').setAttribute('message', '错误');
  }
}
function onF1Pressed(textarea) {

}

function onF2Pressed(textarea) {

}

function onF3Pressed(textarea) {

}

function onF4Pressed(textarea) {

}

function onF5Pressed(textarea) {

}

function onF6Pressed(textarea) {

}

function onF7Pressed(textarea) {

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