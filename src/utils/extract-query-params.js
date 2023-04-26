// title=vinicius&id=1111

export function extractQueryParams(query){
  return query.substr(1).split('&').reduce((queryParams, query) => {
    const [ key, value ] = query.split('=')

    queryParams[key] = value

    return queryParams
  },{})
}
