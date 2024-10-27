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
  const groupIdSchema = z.object({
    id: z.coerce.number(),
    event_id: z.coerce.number().catch(0),
    event_group: z.coerce.number().catch(0)
  })

  const parsedGroupId = groupIdSchema.safeParse(req.params)

  if (!parsedGroupId.success) return res.status(400).json({ error: "Não foi fornecido o id do evento." })

  const { status, data } = await participants.getOne(parsedGroupId.data)
  const notFoundGroup = Object.keys(data).length <= 0

  if (notFoundGroup) return res.status(404).json({ message: "Grupo não encontrado." })

  res.status(status).json({ ...data })
}

