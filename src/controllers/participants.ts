import { RequestHandler } from "express"
import * as participants from '../services/participants'
import { z } from "zod"

import { cpfFormatter } from "../utils/cpfFormatter"
import { decryptMatch } from "../utils/match"

export const getAllParticipants: RequestHandler = async (req, res) => {
  const paramsSchema = z.object({
    event_id: z.coerce.number(),
    event_group: z.coerce.number().optional()
  })

  const parsedParams = paramsSchema.safeParse(req.params)

  if (!parsedParams.success) return res.status(400).json({ error: "Dados incorretos ou inexistentes." })

  const { status, data } = await participants.getAll(parsedParams.data)
  const emptyGroupParticipant = Object.keys(data).length <= 0

  if (emptyGroupParticipant) return res.status(404).json({ message: "Não existe ninguém cadastrado." })

  res.status(status).json({ ...data })
}

export const getOneParticipant: RequestHandler = async (req, res) => {
  const participantSchema = z.object({
    id: z.coerce.number().catch(0),
    event_id: z.coerce.number().catch(0),
    event_group: z.coerce.number().catch(0),
    cpf: z.string().transform(cpfFormatter).optional()
  })

  const parsedParticipant = participantSchema.safeParse(req.params)

  if (!parsedParticipant.success) return res.status(400).json({ error: "Dados incorretos ou inexistentes." })

  const { status, data } = await participants.getOne(parsedParticipant.data)
  const notFoundParticipant = Object.keys(data).length <= 0

  if (notFoundParticipant) return res.status(404).json({ message: "Participante não encontrado." })

  res.status(status).json({ ...data })
}

export const createParticipant: RequestHandler = async (req, res) => {
  const createParticipantParamsSchema = z.object({
    event_id: z.coerce.number(),
    event_group: z.coerce.number()
  })

  const createParticipantBodySchema = z.object({
    name: z.string(),
    cpf: z.string().transform(cpfFormatter)
  })

  const parsedParams = createParticipantParamsSchema.safeParse(req.params)
  const parsedBody = createParticipantBodySchema.safeParse(req.body)

  if (!parsedParams.success || !parsedBody.success) return res.status(400).json({ error: "Dados incorretos ou inexistentes." })

  const { event_id, event_group } = parsedParams.data
  const { name, cpf } = parsedBody.data
  const isParticipantExists = await participants.getOne({ event_id, event_group, cpf })

  if (isParticipantExists.status === 200) return res.status(400).json({ error: "Participante já cadastrado." })

  const { status, data } = await participants.create({ event_id, event_group, name, cpf })

  if (status === 400) return res.status(status).json({ ...data })

  res.status(status).json({ ...data })
}

export const updateOneOrManyParticipants: RequestHandler = async (req, res) => {
  const updateParticipantParamsSchema = z.object({
    id: z.coerce.number().or(z.undefined()).catch(undefined),
    event_id: z.coerce.number(),
    event_group: z.coerce.number().or(z.undefined()).catch(undefined)
  })

  const updateParticipantBodySchema = z.object({
    name: z.string().optional(),
    cpf: z.string().transform(cpfFormatter).optional(),
    matched: z.string().optional()
  })

  const parsedParams = updateParticipantParamsSchema.safeParse(req.params)
  const parsedBody = updateParticipantBodySchema.safeParse(req.body)

  if (!parsedParams.success) return res.status(400).json({ error: "Não foi fornecido o id do evento ou grupo." })
  if (!parsedBody.success) return res.status(400).json({ error: "Dados incorretos." })

  const { id, event_id, event_group } = parsedParams.data
  const { name, cpf, matched } = parsedBody.data

  const { status, data } = await participants.update({ id, event_id, event_group, name, cpf, matched })

  if (status === 400) return res.status(status).json({ ...data })

  res.status(200).json({ updated: data })
}

export const deleteParticipant: RequestHandler = async (req, res) => {
  const deleteParticipantParamsSchema = z.object({
    id: z.coerce.number(),
    event_id: z.coerce.number().or(z.undefined()).catch(undefined),
    event_group: z.coerce.number().or(z.undefined()).catch(undefined)
  })

  const parsedParams = deleteParticipantParamsSchema.safeParse(req.params)

  if (!parsedParams.success) return res.status(404).json({ error: "Dados incorretos ou inexistentes." })

  const { status, data } = await participants.remove(parsedParams.data)

  if (status === 400) return res.status(status).json({ ...data })

  res.status(status).json({ ...data })
}

export const searchParticipantMatch: RequestHandler = async (req, res) => {
  const searchParamsSchema = z.object({
    event_id: z.coerce.number()
  })

  const searchQuerySchema = z.object({
    cpf: z.string().transform(cpfFormatter)
  })

  const parsedParam = searchParamsSchema.safeParse(req.params)
  const parsedQuery = searchQuerySchema.safeParse(req.query)

  if (!parsedQuery.success || !parsedParam.success) return res.status(400).json({ error: "Dados inválidos." })

  const participant = await participants.getOne({ event_id: parsedParam.data.event_id, cpf: parsedQuery.data.cpf })

  if (participant.status === 200 && ('matched' in participant.data && participant.data.matched)) {
    const matchId = decryptMatch(participant.data.matched)

    const matchedParticipants = await participants.getOne({
      event_id: parsedParam.data.event_id,
      id: matchId
    })

    if (matchedParticipants.status === 200 && ('matched' in matchedParticipants.data)) {
      return res.status(200).json({
        person: {
          id: participant.data.id,
          name: participant.data.name
        },
        matchedParticipant: {
          id: matchedParticipants.data.id,
          name: matchedParticipants.data.name
        }
      })
    }
  }

  res.json({ error: "Ocorreu um erro." })
}