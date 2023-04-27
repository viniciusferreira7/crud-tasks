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
    let statusCode = 400
    let message = ''
    const missingFromBody = this.#validationKey(data, ['title','description'])

    const oneKey = missingFromBody.length === 1 && missingFromBody[0]

    let error = {
      1: `Está faltando o campo ${oneKey}`,
      2: 'Está faltando o campo title e description'
    }

    message = error[missingKeys.length]
    console.log(  )
      
    if(Array.isArray(this.#database[table])){
      statusCode = 201
      this.#database[table].push(data)

    } else {
      statusCode = 201
      this.#database[table] = [data]
    }

    this.#persist()
    return {statusCode}
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

  #validationKey(data, key ){
    let missingKeys = []
    
    const expectedKeys = data

    for(let key in expectedKeys ){
      if(!data.hasOwnProperty(key)){
       missingKeys.push(key)
      }
    }

    return missingKeys
  }

}