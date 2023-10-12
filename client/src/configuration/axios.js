export const axios = require('axios').create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  withCredentials: true,
});
