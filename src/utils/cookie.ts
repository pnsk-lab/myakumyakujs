import type { Session } from "../mod.ts";

export const getCookie = (from: Response | Headers | string): Record<string, string> => {
  // 1. 入力から set-cookie 情報を抽出
  let cookieHeaders: string[] = [];

  if (typeof from === 'string') {
    cookieHeaders = from.split('\n').map(h => h.trim()).filter(Boolean);
  } else if (from instanceof Headers) {
    // Headers.get()は1つしか返さないので Headers.getSetCookie の代わりに Headers.raw() 的な取得が必要（Node Fetch API互換の場合）
    const sc = from.get('set-cookie');
    if (sc) cookieHeaders = sc.split(/,(?=[^;]+=[^;]+)/); // 複数cookieを分割
  } else {
    const sc = from.headers.get('set-cookie');
    if (sc) cookieHeaders = sc.split(/,(?=[^;]+=[^;]+)/);
  }

  const result: Record<string, string> = {};

  // 2. 各 cookie ヘッダーを解析
  for (const cookieStr of cookieHeaders) {
    const [pair] = cookieStr.split(';'); // 最初の name=value 部分だけ
    const [name, ...rest] = pair.split('=');
    if (!name) continue;
    result[name.trim()] = rest.join('=').trim();
  }

  return result;
};
export const stringifyCookie = (cookies: Record<string, string> | Session): string => {
  return Object.entries(cookies)
    .filter(([_, value]) => value !== undefined && value !== null) // 無効値除外
    .map(([name, value]) => 
      `${encodeURIComponent(name)}=${encodeURIComponent(value)}`
    )
    .join('; ');
};
