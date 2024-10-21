import client from "../lib/prisma-client"

export const getAll = () => {
  const response = client.event.findMany()
    .then(data => ({ status: 200, data }))
    .catch(() => ({ status: 404, data: { error: 'Ocorreu um erro.' } }))

  return response
}

export const getOne = (id: number) => {
  const response = client.event.findUniqueOrThrow({ where: { id } })
    .then(data => ({ status: 200, data }))
    .catch(() => ({ status: 404, data: { error: 'Id não encontrado.' } }))

  return response
}
