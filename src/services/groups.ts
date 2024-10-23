import client from "../lib/prisma-client"

type GroupIds = {
  id: number
  event_id?: number
}

export const getAll = (event_id: number) => {
  const response = client.event_Group.findMany({ where: { event_id } })
    .then(data => ({ status: 200, data }))
    .catch(() => ({ status: 404, data: { error: 'Ocorreu um erro.' } }))

  return response
}

export const getOne = ({ id, event_id }: GroupIds) => {
  const response = client.event_Group.findFirstOrThrow({ where: { OR: [{ id }, { event_id }] } })
    .then(data => ({ status: 200, data }))
    .catch(() => ({ status: 404, data: { error: 'Grupo não encontrado.' } }))

  return response
}
