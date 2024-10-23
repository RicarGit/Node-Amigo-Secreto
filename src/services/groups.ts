import client from "../lib/prisma-client"

export const getAll = (event_id: number) => {
  const response = client.event_Group.findMany({ where: { event_id } })
    .then(data => ({ status: 200, data }))
    .catch(() => ({ status: 404, data: { error: 'Ocorreu um erro.' } }))

  return response
}
