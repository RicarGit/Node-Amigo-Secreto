import client from "../lib/prisma-client"

type ParticipantsIDs = {
  event_id: number
  event_group: number
}


export const getAll = ({ event_id, event_group }: ParticipantsIDs) => {
  const response = client.participant.findMany({ where: { event_id, event_group }, orderBy: { id: 'asc' } })
    .then(data => ({ status: 200, data }))
    .catch(() => ({ status: 404, data: { error: 'Ocorreu um erro.' } }))

  return response
}
