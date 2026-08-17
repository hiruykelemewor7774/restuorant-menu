import { SignJWT, jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  process.env.RECEPTIONIST_JWT_SECRET || "change-this-secret",
);

export const RECEPTIONIST_COOKIE_NAME = "receptionist_session";
export const RECEPTIONIST_SESSION_MINUTES = 240;

export interface ReceptionistSessionPayload {
  receptionistId: string;
  username: string;
  [key: string]: unknown;
}

export async function createReceptionistToken(
  payload: ReceptionistSessionPayload,
) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${RECEPTIONIST_SESSION_MINUTES}m`)
    .sign(SECRET_KEY);
}

export async function verifyReceptionistToken(
  token: string,
): Promise<ReceptionistSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as ReceptionistSessionPayload;
  } catch {
    return null;
  }
}
