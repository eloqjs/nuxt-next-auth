import { authOptions } from '../auth/[...]'
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event, authOptions)
  return session
})
