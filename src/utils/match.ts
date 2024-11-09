export const encryptMatch = (id: number): string => {
  return `${process.env.DEFAULT_TOKEN}${id}${process.env.DEFAULT_TOKEN}`
}

