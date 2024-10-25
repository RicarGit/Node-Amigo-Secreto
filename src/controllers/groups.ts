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

export const createGroup: RequestHandler = async (req, res) => {
  const createEventGroupParamsSchema = z.object({
    event_id: z.coerce.number()
  })

  const createEventGroupBodySchema = z.object({
    name: z.string()
  })

  const parsedParams = createEventGroupParamsSchema.safeParse(req.params)
  const parsedBody = createEventGroupBodySchema.safeParse(req.body)

  if (!parsedParams.success || !parsedBody.success) return res.status(400).json({ error: 'Dados inválidos.' })

  const { event_id } = parsedParams.data
  const { name } = parsedBody.data
  const { status, data } = await groups.create({ event_id, name })

  if (status === 400) return res.status(status).json({ ...data })

  res.status(status).json({ ...data })
}
