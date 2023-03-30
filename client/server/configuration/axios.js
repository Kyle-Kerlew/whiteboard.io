module.exports = {
    axios: require('client/server/configuration/axios').create({
        baseURL: process.env.REACT_APP_BASE_URL,
        withCredentials: true
    })
}
