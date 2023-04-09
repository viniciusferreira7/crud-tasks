import { randomUUID } from 'node:crypto'

import { Database } from './database.js'

const database = new Database()
export const routes = [
  {
    method: 'GET',
    path:'/tasks',
    handler:(req, res) => {

    const data = database.select('tasks')
    
     return res.writeHead(200).end(JSON.stringify(data))
    }
  },

  {
    method: 'POST',
    path:'/tasks',
    handler:(req, res) => {

      const { title, description } = req.body

      const optionsDate = {
        year:'numeric',
        month:'2-digit',
        day:'2-digit'
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        created_at: new Date().toLocaleString('pt-BR', optionsDate),
      }

      database.insert('tasks',task)

      return res.writeHead(201).end()
    }
  }
]