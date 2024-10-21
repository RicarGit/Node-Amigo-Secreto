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
  const newEvent = await events.create({ title, description })

  if (!newEvent) return res.status(400).json({ error: 'Ocorreu um erro.' })

  res.status(201).json({ message: 'Evento criado com sucesso.', event: newEvent })
}
