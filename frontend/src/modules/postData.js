import { baseUrl, logUrl } from "./data";

export async function postData(url, data) {
  const token = localStorage.getItem("token");
  const fd = new FormData();
  let response;

  fd.append("data", JSON.stringify(data));
  try {
    response = await (
      await fetch(`${baseUrl}${url}`, {
        method: "POST",
        body: fd,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    ).json();
    if (response.code === 401) {
      sessionStorage.setItem("token", "");
      window.location.href = "/";
    }
    return response;
  } catch (err) {}
}

export async function getData(url) {
  const response = await (
    await fetch(`${baseUrl}${url}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
  ).json();
  if (response.code === 401) {
    localStorage.setItem("token", "");
    window.location.href = "/";
  }
  return response;
}

export async function getToken(data) {
  return await (
    await fetch(logUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: data[0], password: data[1] }),
    })
  ).json();
}
