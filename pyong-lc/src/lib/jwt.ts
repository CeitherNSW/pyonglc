import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'dev-secret-key';

export function signToken(payload: object, expiresIn = '24h') {
  return jwt.sign(payload, SECRET, { expiresIn } as any);
}

export function verifyToken(token: string) {
  return jwt.verify(token, SECRET);
}