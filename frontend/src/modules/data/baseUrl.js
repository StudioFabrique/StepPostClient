const port = 8000;

//const url = `https://test-poste.herokuapp.com`;

const url = `http://127.0.0.1`;
 
const baseUrl = `${url}:${port}/api/client`;

const logUrl = `${url}:${port}/api/login_check`;

const qrcodeUrl = `${url}:${port}/assets/qrcodes/`;

export { baseUrl, logUrl, qrcodeUrl };/* 

const baseUrl = `${url}/api/client`;

const logUrl = `${url}/api/login_check`;

const qrcodeUrl = `${url}/assets/qrcodes/`;

export { baseUrl, logUrl, qrcodeUrl }; */