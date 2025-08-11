import type { Session } from "./auth.ts";
import { stringifyCookie } from "./utils/cookie.ts";

export interface EventItem {
  id: number;
  event_code: string;
  event_name: string;
  program_code: string;
  event_summary: string;
  virtual_url: string;
  virtual_url_desc: string;
  portal_url: string;
  portal_url_desc: string;
  date_status: number;
}

export interface EventListResponse {
  list: EventItem[];
  exists_next: boolean;
  next_token: string;
}

export const fetchEvents = async (sess: Session) => {
  const res = await fetch('https://ticket.expo2025.or.jp/api/d/events?ticket_ids[]=ZHHADFXDKJ&entrance_date=20250813&count=1&limit=20&event_type=0&next_token=&channel=4', {
    headers: {
      cookie: stringifyCookie(sess)
    }
  }).then(res => res.json()) as EventListResponse

  return res
}