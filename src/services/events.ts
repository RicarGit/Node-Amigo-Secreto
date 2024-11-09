import { Prisma } from "@prisma/client"
import client from "../lib/prisma-client"

import * as participants from "../services/participants"
import { encryptMatch } from "../utils/match"

type CreateEventPayload = Pick<Prisma.EventCreateInput, 'title' | 'description'>

type UpdateEventPayload = {
  status?: boolean
  title?: string
  description?: string
  grouped?: boolean
}

type SortedList = {
  id: number,
  match: number
}

export const getAll = () => {
  const response = client.event.findMany({ orderBy: { id: 'asc' } })
    .then(data => ({ status: 200, data }))
    .catch(() => ({ status: 404, data: { error: 'Ocorreu um erro.' } }))

  return response
}

export const getOne = (id: number) => {
  const response = client.event.findUniqueOrThrow({ where: { id } })
    .then(data => ({ status: 200, data }))
    .catch(() => ({ status: 404, data: { error: 'Evento não encontrado.' } }))

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

export const beginMatch = async (id: number): Promise<boolean> => {
  const groupedEvents = await client.event.findFirst({ where: { id }, select: { grouped: true } })

  if (groupedEvents) {
    const participantsList = await participants.getAll({ event_id: id })

    if (participantsList.status === 200 && Array.isArray(participantsList.data)) {
      let sortedList: SortedList[] = []
      let sortable: number[] = []

      let attempts = 0
      let maxAttenpts = participantsList.data.length
      let keepTrying = true

      while (keepTrying && attempts < maxAttenpts) {
        keepTrying = false
        attempts++
        sortedList = []
        sortable = participantsList.data.map(participant => participant.id)

        for (let i in participantsList.data) {
          let sortableFiltered: number[] = sortable

          if (groupedEvents.grouped) {
            sortableFiltered = sortable.filter(sortableItem => {
              let sortableParticipant = Array.isArray(participantsList.data) && participantsList.data.find(participant => participant.id === sortableItem)

              return Array.isArray(participantsList.data) &&
                sortableParticipant &&
                participantsList.data[i].event_group !== sortableParticipant.event_group
            })
          }

          if ((sortableFiltered.length === 0) || (sortableFiltered.length === 1 && participantsList.data[i].id === sortableFiltered[0])) {
            keepTrying = true
          } else {
            let sortedIndex = Math.floor(Math.random() * sortableFiltered.length)

            while (sortableFiltered[sortedIndex] === participantsList.data[i].id) {
              sortedIndex = Math.floor(Math.random() * sortableFiltered.length)
            }

            sortedList.push({
              id: participantsList.data[i].id,
              match: sortableFiltered[sortedIndex]
            })

            sortable = sortable.filter(item => item !== sortableFiltered[sortedIndex])
          }
        }
      }

      if (attempts < maxAttenpts) {
        for (let i in sortedList) {
          await participants.update({
            id: sortedList[i].id,
            event_id: id,
            matched: encryptMatch(sortedList[i].match)
          })
        }

        return true
      }
    }
  }

  return false
}