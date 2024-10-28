import { Router } from "express"
import * as auth from '../controllers/auth'
import * as event from '../controllers/events'
import * as group from '../controllers/groups'
import * as participant from '../controllers/participants'

const router = Router()

router.get('/ping', auth.validate, (_, res) => res.json({ pong: true, admin: true }))

router.post('/login', auth.login)

router.get('/events', auth.validate, event.getAllEvents)
router.post('/events', auth.validate, event.createEvent)
router.get('/events/:id', auth.validate, event.getOneEvent)
router.put('/events/:id', auth.validate, event.updateEvent)
router.delete('/events/:id', auth.validate, event.deleteEvent)

router.get('/events/:event_id/groups', auth.validate, group.getAllGroups)
router.post('/events/:event_id/groups', auth.validate, group.createGroup)
router.get('/events/:event_id/groups/:id', auth.validate, group.getOneGroup)
router.put('/events/:event_id/groups/:id', auth.validate, group.updateGroup)
router.delete('/events/:event_id/groups/:id', auth.validate, group.deleteGroup)

router.get('/events/:event_id/groups/:event_group/participants', auth.validate, participant.getAllParticipants)
router.post('/events/:event_id/groups/:event_group/participants', auth.validate, participant.createParticipant)
router.get('/events/:event_id/groups/:event_group/participants/:id', auth.validate, participant.getOneParticipant)

export default router