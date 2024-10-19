import { RequestHandler } from "express"
import * as events from '../services/events'

export const getAll: RequestHandler = async (_, res) => {
  const { status, data } = await events.getAll()

  res.status(status).json({ ...data })
}