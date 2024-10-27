import client from "../lib/prisma-client"

type ParticipantsIDs = {
  event_id: number
  event_group: number
}

interface OneParticipantIDs extends ParticipantsIDs {
  id: number
}

export const getAll = ({ event_id, event_group }: ParticipantsIDs) => {
  const response = client.participant.findMany({ where: { event_id, event_group }, orderBy: { id: 'asc' } })
    .then(data => ({ status: 200, data }))
    .catch(() => ({ status: 404, data: { error: 'Ocorreu um erro.' } }))

  return response
}

export const getOne = ({ id, event_id, event_group }: OneParticipantIDs) => {
  const response = client.participant.findFirstOrThrow({ where: { event_id, event_group, id } })
    .then(data => ({ status: 200, data }))
    .catch(() => ({ status: 404, data: { error: 'Participante não encontrado.' } }))

  return response
}

