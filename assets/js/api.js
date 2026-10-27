// ACK Kambaa Primary School — API helper
const API = '/api';

let token = localStorage.getItem('ack_token');
let currentUser = JSON.parse(localStorage.getItem('ack_user') || 'null');

async function api(method, path, body = null, isForm = false) {
    const opts = { method, headers: {} };

    if (token) {
        opts.headers.Authorization = 'Bearer ' + token;
    }

    if (body && !isForm) {
        opts.headers['Content-Type'] = 'application/json';
        opts.body = JSON.stringify(body);
    }

    if (body && isForm) {
        opts.body = body;
    }

    const res = await fetch(API + path, opts);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data.message || 'Request failed');
    }

    return data;
}
