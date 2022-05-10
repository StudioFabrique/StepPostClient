import { baseUrl, logUrl } from "./data";

export async function postData(url, data) {
    const token = sessionStorage.getItem('token');
    const fd = new FormData();
    let response;

    fd.append('data', JSON.stringify(data));
    try {
        response = await (await fetch(`${baseUrl}${url}`, {
            method: 'POST',
            body: fd,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })).json();
        if (response.code === 401) {
            sessionStorage.setItem('token', '');
            window.location.href = "/";
        }
        return response
    } catch (err) {
    }
}

export async function getData(url) {
    const response =  await (await fetch(`${baseUrl}${url}`, {
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
    })).json();
    if (response.code === 401) {
        sessionStorage.setItem('token', '');
        window.location.href = "/";
    }
    return response
}

export async function getToken(data) {
    return await (await fetch(logUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'username': data[0], 'password': data[1] })
    })).json();
}

export async function getQrcode(bordereau) {
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Host': 'qrcode-monkey.p.rapidapi.com',
            'X-RapidAPI-Key': '0bcce56befmshda09e300658e601p1a6cdfjsn4c3414ac3725'
        },
        body: `{"data":${bordereau},"config":{"body":"rounded-pointed","eye":"frame14","eyeBall":"ball16","erf1":[],"erf2":["fh"],"erf3":["fv"],"brf1":[],"brf2":["fh"],"brf3":["fv"],"bodyColor":"#5C8B29","bgColor":"#FFFFFF","eye1Color":"#3F6B2B","eye2Color":"#3F6B2B","eye3Color":"#3F6B2B","eyeBall1Color":"#60A541","eyeBall2Color":"#60A541","eyeBall3Color":"#60A541","gradientColor1":"#5C8B29","gradientColor2":"#25492F","gradientType":"radial","gradientOnEyes":false,"logo":""},"size":300,"download":false,"file":"png"}`
    };
    return await (await fetch('https://qrcode-monkey.p.rapidapi.com/qr/custom', options)).json();
}