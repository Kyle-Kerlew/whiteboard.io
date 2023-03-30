export const axios = require('axios').create({
  baseURL: process.env.REACT_APP_BASE_URL,
  withCredentials: true,
});
