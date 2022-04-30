function Logout() {
    sessionStorage.setItem('token', '');
    window.location.href = '/';
}

export default Logout;