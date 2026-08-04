import { SignJWT, jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  process.env.KITCHEN_JWT_SECRET || "change-this-secret"
);

export const KITCHEN_COOKIE_NAME = "kitchen_session";
export const KITCHEN_SESSION_MINUTES = 480; // 8 ሰአት (የስራ ፈረቃ)

export interface KitchenSessionPayload {
  kitchenId: string;
  username: string;
  [key: string]: unknown;
}

export async function createKitchenToken(payload: KitchenSessionPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${KITCHEN_SESSION_MINUTES}m`)
    .sign(SECRET_KEY);
}

export async function verifyKitchenToken(
  token: string
): Promise<KitchenSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as KitchenSessionPayload;
  } catch {
    return null;
  }
}