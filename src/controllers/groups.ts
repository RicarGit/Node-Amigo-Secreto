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

export const updateGroup: RequestHandler = async (req, res) => {
  const updateGroupParamsSchema = z.object({
    id: z.coerce.number(),
    event_id: z.coerce.number()
  })

  const updateGroupBodySchema = z.object({
    name: z.string()
  })

  const parsedBody = updateGroupBodySchema.safeParse(req.body)
  const parsedParams = updateGroupParamsSchema.safeParse(req.params)

  if (!parsedParams.success) return res.status(400).json({ error: "Não foi fornecido o id do evento ou grupo." })
  if (!parsedBody.success) return res.status(400).json({ error: "Dados incorretos ou inexistentes." })

  const { id, event_id } = parsedParams.data
  const { name } = parsedBody.data
  const { status, data } = await groups.update({ id, event_id, name })

  if (status === 400) return res.status(status).json({ ...data })

  res.status(200).json({ ...data })
}

export const deleteGroup: RequestHandler = async (req, res) => {
  const deleteGroupParamsSchema = z.object({
    id: z.coerce.number(),
    event_id: z.coerce.number()
  })

  const parsedParams = deleteGroupParamsSchema.safeParse(req.params)

  if (!parsedParams.success) return res.status(404).json({ error: 'Não foi fornecido o id do evento.' })

  const { id, event_id } = parsedParams.data
  const { status, data } = await groups.remove(id, event_id)

  if (status === 400) return res.status(status).json({ ...data })

  res.status(status).json({ ...data })
}