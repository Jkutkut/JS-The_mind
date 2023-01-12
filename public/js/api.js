async function makeRequestAPI(request) {
    return await fetch(
        request,
        {
            method: 'GET'
        }
    );
}

async function postAPI(url, data = {}) {
    return await fetch(
        url,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
    );
}

// JSON stringify
let indentArr;
function indent(depth) {
    if (indentArr == undefined)
        indentArr = [];
    if (indentArr[depth] == undefined)
        indentArr[depth] = "  ".repeat(depth);
    return indentArr[depth];
}

function stringifyJSON(data, depth = 0) {
    let s;
    if (Array.isArray(data)) {
        if (data.length == 0)
            return `[]`;
        s = `[\n`;
        for (let i = 0; i < data.length; i++) {
            s += `${indent(depth + 1)}${stringifyJSON(data[i], depth + 1)},\n`;
        }
        s = s.slice(0, -2) + `\n${indent(depth)}]`;
    }
    else if (typeof data == 'object') {
        if (data == {})
            return `{}`;
        else if (data == null)
            return '<obj>null</obj>';
        s = `{\n`;
        for (let key in data) {
            s += indent(depth + 1);
            s += `${key}: ${stringifyJSON(data[key], depth + 1)},\n`;
        }
        s = s.slice(0, -2) + `\n${indent(depth)}}`;
    }
    else {
        if (typeof data == 'string')
            s = `<string>${data}</string>`;
        else if (typeof data == 'number')
            s = `<number>${data}</number>`;
        else if (typeof data == 'boolean')
            s = `<boolean>${data}</boolean>`;
        else
            s = data;
    }
    return s;
}