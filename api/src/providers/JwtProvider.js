// Author: TrungQuanDev: https://youtube.com/@trungquandev
import jwt from 'jsonwebtoken';

// Must storage signature key into ENV variable (in .env file)
export const ACCESS_TOKEN_SECRET_SIGNATURE = 'KBgJwUETt4HeVD05WaXXI9V3JnwCVP';
export const REFRESH_TOKEN_SECRET_SIGNATURE = 'fcCjhnpeopVn2Hg1jG75MUi62051yL';
export const ACCESS_TOKEN_EXPIRED = '1h';
export const REFRESH_TOKEN_EXPIRED = '15 days';

export const generateToken = async (userInfo, signatureKey, expiresIn) => {
  try {
    return jwt.sign(userInfo, signatureKey, { algorithm: 'HS256', expiresIn });
  } catch (error) {
    throw new Error(error);
  }
};

export const verifyToken = async (token, signatureKey) => {
  try {
    return jwt.verify(token, signatureKey);
  } catch (error) {
    throw new Error(error);
  }
};
