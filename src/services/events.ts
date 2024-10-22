import { Prisma } from "@prisma/client"
import client from "../lib/prisma-client"

type CreateEventPayload = Pick<Prisma.EventCreateInput, 'title' | 'description'>

type UpdateEventPayload = {
  status?: boolean
  title?: string
  description?: string
  grouped?: boolean
}

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

export const create = (event: CreateEventPayload) => {
  const response = client.event.create({ data: event })
    .then(data => ({ status: 200, data }))
    .catch(() => ({ status: 400, data: { error: 'Ocorreu um erro ao cadastrar.' } }))

  return response
}

export const update = (id: number, eventPayload: UpdateEventPayload) => {
  const response = client.event.update({ where: { id }, data: eventPayload })
    .then(data => ({ status: 200, data }))
    .catch(() => ({ status: 400, data: { error: 'Ocorreu um erro ao atualizar.' } }))

  return response
}

export const remove = (id: number) => {
  const response = client.event.delete({ where: { id } })
    .then(data => ({ status: 200, data }))
    .catch(() => ({ status: 400, data: { error: 'Ocorreu um erro ao deletar.' } }))

  return response
}