import { SignJWT, jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  process.env.STORE_JWT_SECRET || "change-this-secret-in-env-file",
);

export const STORE_COOKIE_NAME = "store_session";
export const INACTIVITY_LIMIT_MINUTES = 15;

export interface StoreSessionPayload {
  storeId: string;
  username: string;
  fullName?: string;
  [key: string]: unknown;
}

export async function createStoreToken(payload: StoreSessionPayload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${INACTIVITY_LIMIT_MINUTES}m`)
    .sign(SECRET_KEY);

  return token;
}

export async function verifyStoreToken(
  token: string,
): Promise<StoreSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as StoreSessionPayload;
  } catch {
    return null;
  }
}
