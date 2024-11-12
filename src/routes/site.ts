import { Router } from "express"
import * as events from '../controllers/events'

const router = Router()

router.get('/ping', (_, res) => res.status(200).json({ ping: 'pong' }))

router.get('/events/:id', events.getOneEvent)

export default router