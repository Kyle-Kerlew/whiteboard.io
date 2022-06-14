module.exports = {
    axios: require('axios').create({
        baseURL: process.env.REACT_APP_URL,
        withCredentials: true
    })
}
