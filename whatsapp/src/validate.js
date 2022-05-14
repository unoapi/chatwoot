export default async json => {
  if(Object.keys(json).length <= 0 ){
    throw 'Config data is empty'
  }
  return true
}