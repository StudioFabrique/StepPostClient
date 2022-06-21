const port = 8000;

const remoteUrl = `https://test-poste.herokuapp.com`;

const localUrl = `http://127.0.0.1:${port}`;

const baseUrl = `${remoteUrl}/api`;

const logUrl = `${baseUrl}/login_check`;

const qrcodeUrl = `${localUrl}/assets/qrcodes/`;

export { baseUrl, logUrl, qrcodeUrl };
