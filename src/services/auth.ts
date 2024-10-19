import { getToday } from "../utils/getToday"

export const validatePassword = (password: string) => {
  const currentPassword = getToday().split('/').join('')
  return password === currentPassword
}

