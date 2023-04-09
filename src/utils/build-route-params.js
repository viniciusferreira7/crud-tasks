export function buildRouteParams(path){
  const routeParams = /:([a-z0-9]*)/g

  const pathWithParams = path.replaceAll(routeParams, '/([\/a-z0-9A-Z\/_-]*)/')

  // task: ajustar regExp 
  console.log(pathWithParams)

  return new RegExp(`^${pathWithParams}`)
}
