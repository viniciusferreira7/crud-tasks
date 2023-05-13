import { parse, CsvError } from 'csv-parse'

export async function transformCSV(req, res){
  let buffer = []


  for await (const chunk of req){
    buffer.push(chunk)
  }

  let tasks = []

  const csv = Buffer.concat(buffer).toString()
  const parser =  parse(csv, {
    trim: true,
    columns: true,
  })

  for await (const task of parser){
    tasks.push(task)
  }

  try {
    req.csv = tasks
  } catch {
    req.csv = null
  }

  return res.setHeader('Content-Type', 'text/html')
}