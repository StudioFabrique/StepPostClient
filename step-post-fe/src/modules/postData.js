export async function postData(url, data) {
    const token = sessionStorage.getItem('token');
    const fd = new FormData();
    let response;

    fd.append('data', JSON.stringify(data));
    try {
        response = await (await fetch(url, {
            method: 'POST',
            body: fd,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })).json();
        if (response.code === 401) {
            window.location.href = "/";
        }
        return response
    } catch (err) {
        console.log(err);
    }
}

export async function getToken(url, data) {
    return await (await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'username': data[0], 'password': data[1] })
    })).json();
}