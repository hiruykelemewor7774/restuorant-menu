import { SignJWT, jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  process.env.WAITER_JWT_SECRET || "change-this-secret-in-env-file"
);

export const WAITER_COOKIE_NAME = "waiter_session";

// ገፁን ላይ ምንም እንቅስቃሴ ካልተደረገ በስንት ደቂቃ auto-logout እንደሚደረግ
export const INACTIVITY_LIMIT_MINUTES = 15;

export interface WaiterSessionPayload {
  waiterId: string;
  username: string;
  fullName?: string;
  [key: string]: unknown;
}

export async function createWaiterToken(payload: WaiterSessionPayload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${INACTIVITY_LIMIT_MINUTES}m`)
    .sign(SECRET_KEY);

  return token;
}

export async function verifyWaiterToken(
  token: string
): Promise<WaiterSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as WaiterSessionPayload;
  } catch {
    return null;
  }
}