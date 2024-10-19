import { RequestHandler } from "express"
import { z } from "zod"

import * as auth from '../services/auth'

export const login: RequestHandler = (req, res) => {
  const loginSchema = z.object({
    password: z.string().min(3)
  })

  const body = loginSchema.safeParse(req.body)

  if (!body.success) return res.json({ error: 'Dados inválidos.' })

  if (!auth.validatePassword(body.data.password)) {
    return res.status(403).json({ error: 'Senha incorreta.' })
  }

  res.json({ token: auth.createToken() })
}

