import client from "../lib/prisma-client"

export const getAll = () => {
  const response = client.event.findMany()
    .then(data => ({ status: 200, data }))
    .catch(() => ({ status: 404, data: { error: 'Ocorreu um erro.' } }))

  return response
}