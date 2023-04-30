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
      statusCode = 201
      this.#database[table] = [data]
    }

    this.#persist()
  }

  select(table, search){
    let data = this.#database[table] ?? [] 
    if(search){
     data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase())
        })
      })
    }

    return data

  }

  complete(table, id){
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if(rowIndex > -1){
      const task = this.#database[table].slice(rowIndex, 1)
      const completedTask = {...task[0], completed: true}

      this.#database[table].splice(rowIndex, 1, completedTask)
      
      this.#persist()
    }

    return { message: 'Esse registro não existe'}
  }

  update(table, {id, ...data}){
    let statusCode = 404
    let message = 'Esse registro não existe'

    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if( rowIndex > -1 ){
    
      const data = this.#database[table].slice(rowIndex, 1)
      const updateData = {...data[0], ...data}

      message = updateData

      this.#database[table].splice(rowIndex, 1, updateData)
      this.#persist()

      statusCode = 200

      return {statusCode, message}
    }

    return { statusCode, message }

  }

  delete(table, id){
   const rowIndex = this.#database[table].findIndex(row => row.id === id)

   if(rowIndex > -1){
      this.#database[table].splice(rowIndex, 1)
   }

   this.#persist()
  }

  validationKey(data, keysCannotBeMissing ){

    const keyOfData = Object.keys(data)

    let missingKeys = []

    
    keysCannotBeMissing.map(key => {
      if(!keyOfData.includes(key)) {
        missingKeys.push(key)
      } 
      
      return key
    })

    const message = `Campo obrigatório: ${missingKeys}`
    
    if(missingKeys.length >= 1){
        return message
    }

  }

}