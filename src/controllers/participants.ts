import { RequestHandler } from "express"
import * as participants from '../services/participants'
import { z } from "zod"

export const getAllParticipants: RequestHandler = async (req, res) => {
  const paramsSchema = z.object({
    event_id: z.coerce.number(),
    event_group: z.coerce.number()
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
    cpf: z.string().transform(cpf => cpf.replace(/\.|-/gm, '')).optional()
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
    cpf: z.string().transform(cpf => cpf.replace(/\.|-/gm, ''))
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
    cpf: z.string().transform(cpf => cpf.replace(/\.|-/gm, '')).optional(),
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

  res.status(200).json({ ...data })
}
