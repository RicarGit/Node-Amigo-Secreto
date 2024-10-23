import { Router } from "express"
import * as auth from '../controllers/auth'
import * as event from '../controllers/events'

const router = Router()

router.get('/ping', auth.validate, (_, res) => res.json({ pong: true, admin: true }))

router.post('/login', auth.login)

router.get('/events', auth.validate, event.getAllEvents)
router.post('/events', auth.validate, event.createEvent)
router.get('/events/:id', auth.validate, event.getOneEvent)
router.put('/events/:id', auth.validate, event.updateEvent)
router.delete('/events/:id', auth.validate, event.deleteEvent)

router.get('/events/:event_id/groups', auth.validate, group.getAllGroups)


export default router