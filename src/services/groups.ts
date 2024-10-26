import client from "../lib/prisma-client"
import * as events from "../services/events"

type GroupIds = {
  id: number
  event_id?: number
}

type CreateGroupPayload = {
  event_id: number
  name: string
}

type UpdateGroupPayload = {
  id: number
  event_id: number
  name: string
}

export const getAll = (event_id: number) => {
  const response = client.event_Group.findMany({ where: { event_id }, orderBy: { id: 'asc' } })
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

export const create = async ({ event_id, name }: CreateGroupPayload) => {
  const { status } = await events.getOne(event_id)

  if (status === 404) return { status, data: { error: 'Evento não encontrado.' } }

  const response = client.event_Group.create({ data: { event_id, name } })
    .then(data => ({ status: 201, data }))
    .catch(() => ({ status: 400, data: { error: 'Ocorreu um erro ao cadastrar.' } }))

  return response
}

export const update = ({ id, event_id, name }: UpdateGroupPayload) => {
  const response = client.event_Group.update({ where: { id, event_id }, data: { name } })
    .then(data => ({ status: 200, data }))
    .catch(() => ({ status: 400, data: { error: 'Ocorreu um erro ao atualizar.' } }))

  return response
}

export const remove = (id: number, event_id: number) => {
  const response = client.event_Group.delete({ where: { id, event_id } })
    .then(data => ({ status: 200, data }))
    .catch(() => ({ status: 400, data: { error: 'Ocorreu um erro ao deletar' } }))

  return response
}