export async function getData(url) {
    return await (await fetch(url)).json();
}