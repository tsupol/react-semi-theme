import jwt from 'jsonwebtoken';
require('es6-promise').polyfill();
require('isomorphic-fetch');

function baseUrl(endpoint) {
    let endpointStr = endpoint ? (endpoint.substr(0, 1) == '/' ? endpoint : '/' + endpoint) : '';
    let host = window.location.host;
    // let devProjectName = 'mtpcpos';
    let devProjectName = 'circulate';

    // dev
    if (process.env.NODE_ENV == 'development') {
        if (host.indexOf('192.168.1.9') >= 0) { // other computer on network, fix ip to 192.168.1.9
            return `http://192.168.1.9/${devProjectName}/public/api${endpointStr}`;
        }
        return `http://localhost/${devProjectName}/public/api${endpointStr}`;
    }

    // localhost build
    if (host.indexOf('localhost') >= 0) {
        return `http://localhost/${devProjectName}/public/api${endpointStr}`;
    }
    // production build
    return `/public/api${endpointStr}`;
}
const appKey = 'base64:GLqxLeosxabv4rH6FYsDISUT3yrqdWD3jZGbKiJsqhA=';

function payload(payload) {
    return jwt.sign({
        payload
    }, appKey);
    // return jwt.sign(data, appKey);
}
function verify(encode) {
    return jwt.verify(encode, appKey);
}

function sign(decode) {
    return jwt.sign(decode, appKey);
}

const api = {
    sign,
    verify,
    baseUrl,
    payload
};

export default api;