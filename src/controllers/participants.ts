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
