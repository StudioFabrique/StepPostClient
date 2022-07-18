import { baseUrl, logUrl } from "./data/urls.js";

export async function postData(url, data) {
  const fd = new FormData();

  fd.append("data", JSON.stringify(data));
  try {
    const response = await (
      await fetch(`${baseUrl}${url}`, {
        method: "POST",
        body: fd,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
    ).json();
    if (response.code === 401) {
      window.location.href = "/logout";
    }
    return response;
  } catch (err) {}
}

export async function getData(url) {
  try {
    const response = await (
      await fetch(`${baseUrl}${url}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
    ).json();
    if (response.code === 401) {
      window.location.href = "/logout";
    }
    return response;
  } catch (err) {}
}

export async function getToken(email, password) {
  try {
    const response = await (
      await fetch(logUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password: password }),
      })
    ).json();
    return response;
  } catch (err) {}
}

export async function handShake(token) {
  return await (
    await fetch(`${baseUrl}/handshake`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  ).json();
}
