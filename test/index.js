const jsonServer = require('json-server')
const casual = require("casual");
const server = jsonServer.create()
const middlewares = jsonServer.defaults()
const port = process.env.PORT || 3030
server.use(jsonServer.bodyParser)
server.use(middlewares)

const users = [{
    uid: '001',
    client_id: 'mock',
    created_at: casual.date(),
    email: 'mock@test.com',
    wallet_address: '0x0000000000000000000000000000000000000000'
}, {
    uid: '002',
    client_id: 'mock_2',
    created_at: casual.date(),
    email: 'mock_2@test.com',
    wallet_address: '0x0000000000000000000000000000000000000000'
}]

server.listen(port, () => {
    console.log('JSON Server is running')
})