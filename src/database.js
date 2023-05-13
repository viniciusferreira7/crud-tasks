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
      if(Array.isArray(data)){
        this.#database[table].concat(data)

      } else {
        this.#database[table].push(data)
      }

    } else {
      this.#database[table] = [data]
    }

    console.log(this.#database[table])

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

    const message = this.#validateId(table, id)

    if(!message){
      const task = this.#database[table].slice(rowIndex, 1)
      const completedTask = {...task[0], completed: true}
  
      this.#database[table].splice(rowIndex, 1, completedTask)
      
      this.#persist()
    } else {
      return message
    }

  }

  update(table, {id, ...data}){
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    const message = this.#validateId(table, id)

    if(!message){
    
      const oldTask = this.#database[table].slice(rowIndex, 1)
      const updateData = {...oldTask[0], ...data}

      this.#database[table].splice(rowIndex, 1, updateData)
      this.#persist()

    } else {
      return message
    }

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

  #validateId(table, id){
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    let message = 'Esse registro não existe'

    if(rowIndex === -1){
      return message
    }
  }

}