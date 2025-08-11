import { getCookie, stringifyCookie } from "./utils/cookie.ts";

export interface Session {
  session_id: string
  SESSION: string
  AUTH_SESSION_ID: string
}
export const login = async (username: string, password: string): Promise<Session> => {
  const redirectPage =await fetch('https://ticket.expo2025.or.jp/api/d/expo_login', {
    redirect: 'manual'
  })
  const loginPageUrl = redirectPage.headers.get('location')
  if (!loginPageUrl) {
    throw new Error('Failed to get login page URL')
  }
  const loginPage = await fetch(loginPageUrl, {
    redirect: 'manual'
  })
  const targetUrl = (await loginPage.text()).match(/(?<=action=")[^"]+(?=")/)?.[0].replaceAll('amp;', '')
  if (!targetUrl) {
    throw new Error('Failed to find target URL')
  }

  let curCookies = {
    ...getCookie(loginPage),
    ...getCookie(redirectPage)
  }

  let curRedirector = await fetch(targetUrl, {
    method: 'POST',
    body: new URLSearchParams({
      username,
      password,
      credentialId: ''
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: stringifyCookie(curCookies),
    },
    redirect: 'manual'
  })

  while (true) {
    const location = curRedirector.headers.get('location')
    if (!location) {
      break
    }
    curRedirector = await fetch(new URL(location, curRedirector.url), {
      method: 'GET',
      headers: {
        Cookie: stringifyCookie(curCookies),
      },
      redirect: 'manual'
    })
    curCookies = {
      ...curCookies,
      ...getCookie(curRedirector)
    }
  }
  return {
    session_id: curCookies.session_id,
    SESSION: curCookies.SESSION,
    AUTH_SESSION_ID: curCookies.AUTH_SESSION_ID
  }
}

export interface UserInfo {
  sub: string
  expo_id: string
  last_name: string
  middle_name: string | null
  first_name: string
  buy_available: boolean
  disp_bid_status: number // IDK
}
export const getUserInfo = async (sess: Session) => {
  const json = await fetch('https://ticket.expo2025.or.jp/api/d/account/info/', {
    headers: {
      cookie: stringifyCookie(sess)
    }
  }).then(r => r.json())
  return json
} 