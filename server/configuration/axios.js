module.exports = {
    axios: require('axios').create({
        baseURL: 'http://localhost:3001',
        withCredentials: true
    })
}