import client from "../lib/prisma-client"
import * as groups from "../services/groups"

type ParticipantsIDs = {
  event_id: number
  event_group: number
}

interface OneParticipantIDs extends ParticipantsIDs {
  id?: number
  cpf?: string
}

type CreateParticipantPayload = {
  event_id: number
  event_group: number
  name: string
  cpf: string
}

export const getAll = ({ event_id, event_group }: ParticipantsIDs) => {
  const response = client.participant.findMany({ where: { event_id, event_group }, orderBy: { id: 'asc' } })
    .then(data => ({ status: 200, data }))
    .catch(() => ({ status: 404, data: { error: 'Ocorreu um erro.' } }))

  return response
}

export const getOne = ({ id, event_id, event_group, cpf }: OneParticipantIDs) => {
  const response = client.participant.findFirstOrThrow({ where: { event_id, event_group, OR: [{ id }, { cpf }] } })
    .then(data => ({ status: 200, data }))
    .catch(() => ({ status: 404, data: { error: 'Participante não encontrado.' } }))

  return response
}

export const create = async ({ event_id, event_group, name, cpf }: CreateParticipantPayload) => {
  const { status, data } = await groups.getOne({ id: event_group, event_id })

  if (status === 404) return { status, data }

  const response = client.participant.create({ data: { event_id, event_group, name, cpf } })
    .then(data => ({ status: 201, data }))
    .catch(() => ({ status: 400, data: { error: 'Ocorreu um erro ao cadastrar.' } }))

  return response
}
