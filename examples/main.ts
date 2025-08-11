import '@std/dotenv/load'
import { fetchEvents, getTickets, getUserInfo, login, type Session } from '../src/mod.ts'

const EXPO_USERID = Deno.env.get('EXPO_USERID')
const EXPO_PASSWORD = Deno.env.get('EXPO_PASSWORD')

if (!EXPO_USERID || !EXPO_PASSWORD) {
  throw new Error('env is not valid')
}

let sess: Session
try {
  sess = JSON.parse(await Deno.readTextFile('./sess.json'))
} catch {
  sess = await login(EXPO_USERID, EXPO_PASSWORD)
  await Deno.writeTextFile('./sess.json', JSON.stringify(sess, null, 2))
}

console.log(await fetchEvents(sess))
