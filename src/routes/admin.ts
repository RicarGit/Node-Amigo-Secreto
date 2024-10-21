import { Router } from "express"
import * as auth from '../controllers/auth'
import * as event from '../controllers/events'

const router = Router()

router.get('/ping', auth.validate, (_, res) => res.json({ pong: true, admin: true }))
router.get('/events', auth.validate, event.getAll)
router.post('/login', auth.login)
router.get('/events/:id', auth.validate, event.getOneEvent)

export default router