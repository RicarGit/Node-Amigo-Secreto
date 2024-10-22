import { RequestHandler } from "express"
import * as events from '../services/events'
import { z } from "zod"

export const getAllEvents: RequestHandler = async (_, res) => {
  const { status, data } = await events.getAll()

  res.status(status).json({ ...data })
}

export const getOneEvent: RequestHandler = async (req, res) => {
  const id = Number(req.params.id)
  const { status, data } = await events.getOne(id)

  res.status(status).json({ ...data })
}

export const createEvent: RequestHandler = async (req, res) => {
  const createEventSchema = z.object({
    title: z.string(),
    description: z.string()
  })

  const parsedBody = createEventSchema.safeParse(req.body)

  if (!parsedBody.success) return res.status(400).json({ error: 'Dados inválidos.' })

  const { title, description } = parsedBody.data
  const { status, data } = await events.create({ title, description })

  if (status === 400) return res.status(400).json({ error: data })

  res.status(201).json({ ...data })
}

export const updateEvent: RequestHandler = async (req, res) => {
  const updateEventSchema = z.object({
    status: z.boolean().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    grouped: z.boolean().optional()
  }).refine(body => Object.keys(body).length > 0)

  const eventIdSchema = z.coerce.number()

  const parsedId = eventIdSchema.safeParse(req.params.id)
  const parsedBody = updateEventSchema.safeParse(req.body)

  if (!parsedId.success) return res.status(400).json({ error: "Não foi fornecido o id do evento." })
  if (!parsedBody.success) return res.status(400).json({ error: "Dados incorretos ou inexistentes." })

  const { status, data } = await events.update(parsedId.data, parsedBody.data)

  if (status === 400) return res.status(status).json({ error: data })

  res.status(200).json({ ...data })
}

export const deleteEvent: RequestHandler = async (req, res) => {
  const eventIdSchema = z.coerce.number()
  const parsedId = eventIdSchema.safeParse(req.params.id)

  if (!parsedId.success) return res.status(400).json({ error: 'Dados inválidos.' })

  const { status, data } = await events.remove(parsedId.data)

  if (status === 400) return res.status(status).json({ error: { ...data } })

  res.status(status).json({ ...data })
}