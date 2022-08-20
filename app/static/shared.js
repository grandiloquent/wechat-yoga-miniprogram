async function addJS(jsCode) {
    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = jsCode;
    document.getElementsByTagName('head')[0].appendChild(s);
    return new Promise(((resolve, reject) => {
        s.onload = () => {
            resolve()
        }
        s.onerror = () => {
            reject()
        }
    }))
}

function calculateLoadedPercent(video) {
    if (!video.buffered.length) {
        return '0';
    }
    return (video.buffered.end(0) / video.duration) * 100 + '%';
}

function calculateProgressPercent(video) {
    return ((video.currentTime / video.duration) * 100).toFixed(2) + '%';
}

function camel(string) {
    return string.replaceAll(/[ _-]([a-zA-Z])/g, m => m[1].toUpperCase());
}

function clamp(x, min, max) {
    if (x > max) return max;
    if (x < min) return min;
    return x;
}

function dateToSeconds(string) {
    let match = /(\d+)年(\d+)月(\d+)日/.exec(string);
    if (!match) {
        match = /(\d+)月(\d+)日/.exec(string);
        const t = new Date();
        t.setMonth(parseInt(match[1]) - 1);
        t.setDate(parseInt(match[2]));
        t.setHours(0, 0, 0, 0)
        return t / 1000;
    } else {
        const t = new Date();
        t.setFullYear(parseInt(match[1]))
        t.setMonth(parseInt(match[2]) - 1);
        t.setDate(parseInt(match[3]));
        t.setHours(0, 0, 0, 0)
        return t / 1000;
    }
}

function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

function durationToSeconds(duration) {
    let result = 0;
    if (/(\d{1,2}:){1,2}\d{1,2}/.test(duration)) {
        const pieces = duration.split(':');
        for (let i = pieces.length - 1; i > -1; i--) {
            result += Math.pow(60, i) * parseInt(pieces[pieces.length - i - 1]);
        }
        console.log(result)
        return result;
    }
    result = parseInt(duration);
    if (isNaN(result)) {
        result = 0;
    }
    return result;
}

function formatDuration(ms) {
    if (isNaN(ms)) return '0:00';
    if (ms < 0) ms = -ms;
    const time = {
        hour: Math.floor(ms / 3600) % 24,
        minute: Math.floor(ms / 60) % 60,
        second: Math.floor(ms) % 60,
    };
    return Object.entries(time)
        .filter((val, index) => index || val[1])
        .map(val => (val[1] + '').padStart(2, '0'))
        .join(':');
}

function fuzzysearch(needle, haystack) {
    var hlen = haystack.length;
    var nlen = needle.length;
    if (nlen > hlen) {
        return false;
    }
    if (nlen === hlen) {
        return needle === haystack;
    }
    outer: for (var i = 0, j = 0; i < nlen; i++) {
        var nch = needle.charCodeAt(i);
        while (j < hlen) {
            if (haystack.charCodeAt(j++) === nch) {
                continue outer;
            }
        }
        return false;
    }
    return true;
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function getShortDateString(seconds) {
    const t = new Date(seconds * 1000);
    return `${t.getMonth() + 1}月${t.getDate()}日周${'日一二三四五六'[t.getDay()]}`;
}

async function getStringAsync(uri, options) {
    const response = await fetch(uri, {
        method: 'GET',
        ...options
    });
    if (!response.ok) {
        throw new Error();
    }
    return await response.text();
}

function groupByKey(array, key) {
    return array
        .reduce((hash, obj) => {
            if (obj[key] === undefined) return hash;
            return Object.assign(hash, {[obj[key]]: (hash[obj[key]] || []).concat(obj)})
        }, {})
}

function kebab(string) {
    return string.replaceAll(/(?<=[a-z])[A-Z]/g, m => `_${m}`).toLowerCase()
        .replaceAll(/[ -]([a-z])/g, m => `-${m[1]}`)
}

function range(num, min, max) {
    return Math.min(Math.max(num, min), max);
}

async function readText() {
    const string = await navigator.clipboard.readText();
    return string;
}

function reportError(err) {
    console.log(err)
}

function secondsToDateString(seconds) {
    const t = new Date(seconds * 1000);
    return `${t.getFullYear()}年${t.getMonth() + 1}月${t.getDate()}日`;
}

function secondsToDuration(seconds) {
    return `${(seconds / 3600) | 0}:${(seconds % 3600 / 60).toString().padStart(2, '0')}`
}

function snake(string) {
    return string.replaceAll(/(?<=[a-z])[A-Z]/g, m => `_${m}`).toLowerCase()
        .replaceAll(/[ -]([a-z])/g, m => `_${m[1]}`)
}

function sortObject(obj) {
    return Object.keys(obj).sort().reduce(function (result, key) {
        result[key] = obj[key];
        return result;
    }, {});
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

function substringBeforeLast(string, delimiter, missingDelimiterValue) {
    const index = string.lastIndexOf(delimiter);
    if (index === -1) {
        return missingDelimiterValue || string;
    } else {
        return string.substring(0, index);
    }
}

function touchMove(progressBar, ev) {
    const rect = progressBar.getBoundingClientRect();
    let precent = (ev.touches[0].clientX - rect.x) / (rect.width - 28) * 100;
    precent = clamp(precent, 0, 100);
    return precent;
}

function upperCamel(string) {
    string = camel(string);
    return string.slice(0, 1).toUpperCase() + string.slice(1);
}

function writeText(message) {
    const textarea = document.createElement("textarea");
    textarea.style.position = 'fixed';
    textarea.style.right = '100%';
    document.body.appendChild(textarea);
    textarea.value = message;
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
}

function getBaseUri() {
    return (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:8080' : '';
}

async function launchEditor(key, value, uri) {
    const customInput = document.createElement('custom-input');
    const textarea = document.createElement('textarea');
    customInput.appendChild(textarea);
    document.body.appendChild(customInput);
    textarea.value = value;
    textarea.focus();
    customInput.addEventListener('submit', async evt => {

        const res = await fetch(`${baseUri}${uri}`, {
            method: 'POST',
            body: JSON.stringify({
                [key]: textarea.value
            })
        });
        const obj = await res.text();
        console.log(obj);
    })
}

async function launchTextarea(value, uri, data, cb) {
    const customInput = document.createElement('custom-input');
    const textarea = document.createElement('textarea');
    customInput.appendChild(textarea);
    document.body.appendChild(customInput);
    textarea.value = value;
    textarea.focus();
    customInput.addEventListener('submit', async evt => {

        const res = await fetch(`${uri}`, {
            method: 'POST',
            body: JSON.stringify(data(textarea.value))
        });
        const obj = await res.text();
        cb(obj);
    })
}

// https://docs.rs/convert_case/latest/convert_case/