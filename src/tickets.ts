import type { Session } from "./auth.ts";
import { stringifyCookie } from "./utils/cookie.ts";

export interface DayLottery {
  state: number;
  entrance_date: string;
}

export interface ScheduleLotteries {
  month: unknown[]; // 中身が不明なら unknown[]
  day: DayLottery[];
}

export interface Schedule {
  user_visiting_reservation_id: number;
  use_state: number;
  entrance_date: string;
  gate_type: number;
  schedule_name: string;
  start_time: string;
  proxy_reserve: boolean;
  group_ticket_qr_divi: number;
  admission_time: string | null;
  admission_buf_during: boolean;
  empty_frame: boolean;
  on_the_day: boolean;
  month_lottery: boolean;
  day_lottery: boolean;
  lotteries: ScheduleLotteries;
}

export interface TicketLotteries {
  fast: unknown[]; // 中身が不明なら unknown[]
}

export interface TicketItem {
  id: number;
  ticket_id: string;
  agent_code: string;
  item_group_code: string;
  item_code: string;
  item_group_order: number;
  item_order: number;
  simple_ticket_id: string;
  disp_status: number;
  item_group_name: string;
  item_name: string;
  item_abb_name: string;
  item_summary: string;
  image_large_path: string;
  order_number: string | null;
  receive_type: number;
  received_at: string;
  schedules: Schedule[];
  event_schedules: unknown | null;
  ticket_type_id: string;
  change_reservation: number;
  fast_lottery: boolean;
  lotteries: TicketLotteries;
  adult_type: boolean;
  disp_bid_status: number;
}

export const getTickets = async (sess: Session): Promise<TicketItem[]> => {
  const res = await fetch('https://ticket.expo2025.or.jp/api/d/my/tickets/?count=1', {
    headers: {
      cookie: stringifyCookie(sess)
    }
  }).then(res => res.json())

  return res.list
} 
