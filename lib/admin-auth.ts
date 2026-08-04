import { SignJWT, jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "change-this-secret-in-env-file"
);

export const ADMIN_COOKIE_NAME = "admin_session";
export const ADMIN_SESSION_MINUTES = 60;

export interface AdminSessionPayload {
  adminId: number;
  username: string;
  [key: string]: unknown;
}

export async function createAdminToken(payload: AdminSessionPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${ADMIN_SESSION_MINUTES}m`)
    .sign(SECRET_KEY);
}

export async function verifyAdminToken(
  token: string
): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as AdminSessionPayload;
  } catch {
    return null;
  }
}