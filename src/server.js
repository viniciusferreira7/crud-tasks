import http from 'node:http'

const server = http.createServer((req, res) => {
  return res.writeHead(200).end()
})

server.listen(3333)