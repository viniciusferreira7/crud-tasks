import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf8')
    .then(data => {
      this.#database = JSON.parse(data)
    }).catch(() =>  {
      this.#persist()
    })
  }

  #persist(){
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  insert(table, data){
    if(Array.isArray(this.#database[table])){
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()

    return data
  }

  select(table){
    return this.#database[table] ?? []
  }

  update(table, {id, ...data}){
    let statusCode = 404
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if( rowIndex > -1 ){
    
      const task = this.#database[table].slice(rowIndex, 1)
      const updateTask = {...task[0], ...data}
    
      this.#database[table].splice(rowIndex, 1, updateTask)
      this.#persist()

      statusCode = 200

      return {statusCode, updateTask}
    }

    return { statusCode }

  }

  delete(table, id){
   const rowIndex = this.#database[table].findIndex(row => row.id === id)

   if(rowIndex > -1){
      this.#database[table].splice(rowIndex, 1)
   }

   this.#persist()
  }

}