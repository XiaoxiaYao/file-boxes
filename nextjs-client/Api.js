import axios from 'axios';

axios.defaults.baseURL =
  process.env.NODE_ENV !== 'development'
    ? 'https://file-boxes-server.herokuapp.com'
    : 'http://localhost:4001';
axios.defaults.withCredentials = true;

export const signup = ({ email, password }) =>
  axios.post('/api/auth/sign-up/', {
    email,
    password,
  });

export const signin = ({ email, password }) =>
  axios.post('/api/auth/sign-in/', {
    email,
    password,
  });

export const signout = () => axios.post('/api/auth/sign-out/');

export const currentUser = () => axios.get('/api/auth/current-user/');

export const listBoxes = ({ headers }) => {
  const cookieString = headers.cookie;
  return axios.get('/api/boxes/', {
    headers: {
      cookie: cookieString != undefined ? cookieString : '',
    },
  });
};

export const retrieveBox = (boxId) => axios.get(`/api/boxes/${boxId}`);

export const createBox = ({ name, description }) =>
  axios.post('/api/boxes/', { name, description });

export const updateBox = ({ boxId, name, description }) =>
  axios.patch(`/api/boxes/${boxId}/`, { name, description });

export const deleteBox = (boxId) => axios.delete(`/api/boxes/${boxId}`);

export const uploadFile = (boxId, formData) =>
  axios.post(`/api/boxes/${boxId}/upload-file`, formData, {
    headers: {
      'content-type': 'multipart/form-data',
    },
  });

export const setToPublic = (boxId) =>
  axios.patch(`/api/boxes/${boxId}/set-to-public`);

export const shareBox = ({ boxId, email }) =>
  axios.patch(`/api/boxes/${boxId}/share`, { email });

export const listUsers = () => axios.get('/api/users/');

export const deleteUser = (userId) => axios.delete(`/api/users/${userId}`);
