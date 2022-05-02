import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL;
axios.defaults.withCredentials = true;

export const signup = ({ email, password }) =>
  axios.post('/auth/sign-up/', {
    email,
    password,
  });

export const signin = ({ email, password }) =>
  axios.post('/auth/sign-in/', {
    email,
    password,
  });

export const signout = () => axios.post('/auth/sign-out/');

export const currentUser = () => axios.get('/auth/current-user/');

export const listBoxes = () => axios.get('/boxes/');

export const retrieveBox = (boxId) => axios.get(`/boxes/${boxId}`);

export const createBox = ({ name, description }) =>
  axios.post('/boxes/', { name, description });

export const updateBox = ({ boxId, name, description }) =>
  axios.patch(`/boxes/${boxId}/`, { name, description });

export const deleteBox = (boxId) => axios.delete(`/boxes/${boxId}`);