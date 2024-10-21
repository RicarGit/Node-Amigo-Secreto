import { Router } from "express"
import * as auth from '../controllers/auth'
import * as event from '../controllers/events'

const router = Router()

router.get('/ping', auth.validate, (_, res) => res.json({ pong: true, admin: true }))
router.post('/events', auth.validate, event.createEvent)
router.get('/events/:id', auth.validate, event.getOneEvent)

export default router