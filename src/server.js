import http from 'node:http'
import { routes } from './routes.js'
import { json } from './middleware/json.js'
import { extractQueryParams } from './utils/extract-query-params.js'

const server = http.createServer( async (req, res) => {
  const { method, url } = req

  await json(req, res)

  const route = routes.find(route => {
    return route.method === method && route.path.test(url)
  })

  if(route) {
    const routeParams = url.match(route.path)
    console.log(routeParams)

    const {query, ...params} = {...routeParams.groups}


    req.params = params
    req.query = extractQueryParams(query)

    return route.handler(req, res)
  }

   return res.writeHead(404).end()
})

server.listen(3333)