import { Router } from "express"
import * as events from '../controllers/events'
import * as participants from '../controllers/participants'

const router = Router()

router.get('/ping', (_, res) => res.status(200).json({ ping: 'pong' }))

router.get('/events/:id', events.getOneEvent)
router.get('/events/:event_id/search', participants.searchParticipantMatch)

export default router