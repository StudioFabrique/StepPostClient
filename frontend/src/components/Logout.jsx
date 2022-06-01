function Logout() {
  localStorage.setItem("token", "");
  window.location.href = "/";
}

export default Logout;
