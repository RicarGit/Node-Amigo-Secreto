import { RequestHandler } from "express"
import * as groups from '../services/groups'
import { z } from "zod"

export const getAllGroups: RequestHandler = async (req, res) => {
  const eventIdSchema = z.coerce.number()
  const parsedEventId = eventIdSchema.safeParse(req.params.event_id)

  if (!parsedEventId.success) return res.status(400).json({ error: "Não foi fornecido o id do evento." })

  const { status, data } = await groups.getAll(parsedEventId.data)
  const emptyGroups = Object.keys(data).length <= 0

  if (emptyGroups) return res.status(404).json({ message: "Não existe nenhum grupo criado." })

  res.status(status).json({ ...data })
}

export const getOneGroup: RequestHandler = async (req, res) => {
  const groupIdSchema = z.object({
    id: z.coerce.number(),
    event_id: z.coerce.number().optional().catch(0)
  })

  const parsedGroupId = groupIdSchema.safeParse(req.params)

  if (!parsedGroupId.success) return res.status(400).json({ error: "Não foi fornecido o id do evento." })

  const { status, data } = await groups.getOne(parsedGroupId.data)
  const notFoundGroup = Object.keys(data).length <= 0

  if (notFoundGroup) return res.status(404).json({ message: "Grupo não encontrado." })

  res.status(status).json({ ...data })
}
