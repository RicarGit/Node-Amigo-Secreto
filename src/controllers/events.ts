import { RequestHandler } from "express"
import * as events from '../services/events'

export const getAll: RequestHandler = async (_, res) => {
  const { status, data } = await events.getAll()

  res.status(status).json({ ...data })
}

export const getOneEvent: RequestHandler = async (req, res) => {
  const id = Number(req.params.id)
  const { status, data } = await events.getOne(id)

  res.status(status).json({ ...data })
}

