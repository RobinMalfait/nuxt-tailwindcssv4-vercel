export const getRouteParamAsString = (param: string|string[]) => {
  return Array.isArray(param) ? param[0] : param
}
