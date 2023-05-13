export async function json(req, res) {
  let buffer = []

  for await (const chunk of req){
    buffer.push(chunk)
  }

  try{
    req.body = JSON.parse(Buffer.concat(buffer).toString())
  } catch {
    req.body = null
  }

  // return res.setHeader('Content-Type', ' text/html')
 return res.setHeader('Content-Type', 'application/json')
}