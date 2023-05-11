import http from 'node:http'
import { routes } from './routes.js'
import { json } from './middleware/json.js'
import { extractQueryParams } from './utils/extract-query-params.js'

const server = http.createServer( async (req, res) => {
  const { method, url } = req
  console.log(req.body) // problema a tentar pegar plain text

 if(url !== '/tasks-csv'){
  await json(req, res)
 }

  const route = routes.find(route => {
    return route.method === method && route.path.test(url)
  })

  const isTaskCSV = url.match(route.path)[0] === '/tasks-csv'

  if(route && isTaskCSV) {
    console.log(req.body)
    return route.handler(req, res)

  } else if(route) {

    console.log(route)
    const routeParams = url.match(route.path)
    console.log(routeParams[0])

    const {query, ...params} = {...routeParams.groups}

    req.params = params
    req.query = query ? extractQueryParams(query) : null

    return route.handler(req, res)
  }


   return res.writeHead(404).end()
})


server.listen(3333)