export default async function postData(url, data) {
    const fd = new FormData();
    fd.append('data', JSON.stringify(data));
    return await ( await fetch(url, {
        method: 'POST',
        body: fd
    })).json();
}