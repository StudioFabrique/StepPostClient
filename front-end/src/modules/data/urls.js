const port = 8001;

const remoteUrl = `https://test-poste.herokuapp.com`;

const localUrl = `http://127.0.0.1:${port}`;

const baseUrl = `${localUrl}/api`;

const logUrl = `${baseUrl}/login_check`;

const qrcodeUrl = `${localUrl}/assets/qrcodes/`;

export { baseUrl, logUrl, qrcodeUrl };
