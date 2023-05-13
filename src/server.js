import http from 'node:http'
import { routes } from './routes.js'
import { json } from './middleware/json.js'
import { extractQueryParams } from './utils/extract-query-params.js'
import { transformCSV } from './middleware/transform-csv.js'

const server = http.createServer( async (req, res) => {
  const { method, url } = req
  
  if(url === '/tasks-csv'){
    await transformCSV(req, res)
  } else {
    await json(req, res)
  }

  const route = routes.find(route => {
    return route.method === method && route.path.test(url)
  })

  const isTaskCSV = url.match(route.path)[0] === '/tasks-csv'

   if(route) {
    const routeParams = url.match(route.path)

    const {query, ...params} = {...routeParams.groups}

    req.params = params
    req.query = query ? extractQueryParams(query) : null

    return route.handler(req, res)
  }


   return res.writeHead(404).end()
})


server.listen(3333)