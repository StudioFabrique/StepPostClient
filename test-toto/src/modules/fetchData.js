import { logUrl } from "./data";

export async function postData(url, data, token) {
  try {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    return await (
      await fetch(url, {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      })
    ).json();
  } catch (err) {}
}

export function getData(url, token) {
  try {
    return fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
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
