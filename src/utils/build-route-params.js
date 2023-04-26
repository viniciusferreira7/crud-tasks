export function buildRouteParams(path){
  const routeParams = /:([a-z0-9]*)/g

  const pathWithParams = path.replaceAll(routeParams, '(?<$1>[a-z0-9A-Z\_-]*)')

  const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`)

  return pathRegex
}
