import { getToday } from "../utils/getToday"

export const validatePassword = (password: string) => {
  const currentPassword = getToday().split('/').join('')
  return password === currentPassword
}

export const createToken = () => {
  const currentPassword = getToday().split('/').join('')
  return `${process.env.DEFAULT_TOKEN}${currentPassword}`
}
