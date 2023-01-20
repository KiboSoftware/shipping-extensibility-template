// import fetch from 'node-fetch'

export async function downloadImageToBase64(url: string) {
  const fetch = (await import('node-fetch')) as any
  const response = await fetch(url)
  const blob = await response.arrayBuffer()
  return Buffer.from(blob).toString('base64')
}
