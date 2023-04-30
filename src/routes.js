import { randomUUID } from 'node:crypto'

import { Database } from './database.js'
import { buildRouteParams } from './utils/build-route-params.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path:buildRouteParams('/tasks'),
    handler:(req, res) => {
      

    const data = database.select('tasks',req.query)
    
     return res.writeHead(200).end(JSON.stringify(data))
    }
  },

  {
    method: 'POST',
    path:buildRouteParams('/tasks'),
    handler:(req, res) => {

      
      const message = database.validationKey(req.body, [ 'title', 'description' ])
      
      if(message) {
        return res.writeHead(400).end(JSON.stringify({message}))
      }

      const { title, description } = req.body

      const task = {
        id: randomUUID(),
        title,
        description,
        created_at: new Date().toISOString().toString(),
      }

     database.insert('tasks', task)

      return res.writeHead(201).end()
    }
  },

  {
    method:'PUT',
    path:buildRouteParams('/tasks/:id'),
    handler:(req, res) => {
      const data = req.body
      const { id } = req.params
      
     const message = database.update('tasks', {
        id,
        updated_at: new Date().toISOString().toString(),
        ...data
      } )


      if(message){
        return res.writeHead(404).end(JSON.stringify({message}))
      }

      return res.writeHead(200).end()
    }

  },

  {
    method: 'DELETE',
    path:buildRouteParams('/tasks/:id'),
    handler: (req, res) => {

     const { id } =  req.params 

      database.delete('tasks', id)

      return res.writeHead(204).end()
    }
  }, {
    method: 'PATCH',
    path:buildRouteParams('/tasks/:id/complete'),
    handler: (req, res) => {

      const { id } = req.params

      const message = database.complete('tasks', id)

      if(message) {
        return res.writeHead(404).end(JSON.stringify({message}))
      }

      return res.writeHead(200).end()
    }
  }

]