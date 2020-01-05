import { authHeader, handleResponse } from '@/_helpers';

export const userService = {
    getAll,
    getById
};

function getAll() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(process.env.REACT_APP_BACKEND_URL + '/users', requestOptions).then(handleResponse);
}

function getById(id) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(process.env.REACT_APP_BACKEND_URL + '/users/:id', requestOptions).then(handleResponse);
}