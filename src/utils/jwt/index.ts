import AppConfig from '@/config/appConfig';
import jwt from 'jsonwebtoken';

const JWT_SECRET = AppConfig.JWT_SECRET;

export const generateToken = (payload: object, expiresIn: number): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn,
  });
};

export const verifyToken = (token: string): object | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded as object;
  } catch (error) {
    return null;
  }
};
