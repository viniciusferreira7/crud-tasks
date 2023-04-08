export const routes = [
  {
    method: 'GET',
    path:'/tasks',
    handler:(req, res) => {
     return res.writeHead(200).end('teste')
    }
  }
]