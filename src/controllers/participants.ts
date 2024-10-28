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

  res.status(status).json({ ...data })
}

