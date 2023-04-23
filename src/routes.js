import { randomUUID } from 'node:crypto'

import { Database } from './database.js'
import { buildRouteParams } from './utils/build-route-params.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path:buildRouteParams('/tasks'),
    handler:(req, res) => {

    const data = database.select('tasks')
    
     return res.writeHead(200).end(JSON.stringify(data))
    }
  },

  {
    method: 'POST',
    path:buildRouteParams('/tasks'),
    handler:(req, res) => {

      const { title, description } = req.body

      const task = {
        id: randomUUID(),
        title,
        description,
        created_at: new Date().toISOString().toString(),
      }

      database.insert('tasks',task)

      return res.writeHead(201).end()
    }
  },

  {
    method:'PUT',
    path:buildRouteParams('/tasks/:id'),
    handler:(req, res) => {
      const data = req.body
      const { id } = req.params
      
     const { statusCode, updateTask } = database.update('tasks', {
        id,
        updated_at: new Date().toISOString().toString(),
        ...data
      } )

      return res.writeHead(statusCode).end(JSON.stringify(updateTask))
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
  }

]