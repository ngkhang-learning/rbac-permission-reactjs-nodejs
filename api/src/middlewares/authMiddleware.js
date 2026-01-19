// Author: TrungQuanDev: https://youtube.com/@trungquandev

import { StatusCodes } from 'http-status-codes';
import { ACCESS_TOKEN_SECRET_SIGNATURE, verifyToken } from '~/providers/JwtProvider';

const isAuthorized = async (req, res, next) => {
  // Step 1. Get access token from header/or cookie and valid

  // 1.1 Request Header Authorization: Client save token in Local Storage and attach it into header request (headers.Authorization)
  const accessTokenFromHeader = req.headers.authorization;
  if (!accessTokenFromHeader) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      message: 'UnAuthorized! (Token not found)',
    });
    return;
  }

  // 1.2 Request cookies
  const accessTokenFromCookie = req.cookies?.accessToken;
  if (!accessTokenFromCookie) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      message: 'UnAuthorized! (Token not found)',
    });
    return;
  }

  try {
    // Step 2. Verify access token
    // 2.1 With Request Header Authorization
    // const accessTokenDecoded = await verifyToken(accessTokenFromHeader, ACCESS_TOKEN_SECRET_SIGNATURE);

    // 2.2 With Request cookies
    const accessTokenDecoded = await verifyToken(
      accessTokenFromHeader.substring('Bearer'.length).trim(),
      ACCESS_TOKEN_SECRET_SIGNATURE,
    );

    // Step 3. Attach token valid into req.jwtDecoded to re-use
    req.jwtDecoded = accessTokenDecoded;

    // Step 4. Pass control to the subsequent middleware function
    next();
  } catch (error) {
    // Case: Token expired
    if (error.message?.includes('jwt expired')) {
      // Use Status Code 410 - GONE to handle refresh token
      res.status(StatusCodes.GONE).json({ message: 'Token expired' });
      return;
    }

    // Case: Token invalid
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Please login' });
  }
};

export const authMiddleware = {
  isAuthorized,
};
