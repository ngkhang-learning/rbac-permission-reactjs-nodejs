// Author: TrungQuanDev: https://youtube.com/@trungquandev
import { StatusCodes } from 'http-status-codes';
import ms from 'ms';
import {
  ACCESS_TOKEN_EXPIRED,
  ACCESS_TOKEN_SECRET_SIGNATURE,
  generateToken,
  REFRESH_TOKEN_EXPIRED,
  REFRESH_TOKEN_SECRET_SIGNATURE,
  verifyToken,
} from '~/providers/JwtProvider';

/**
 * Mock nhanh thông tin user thay vì phải tạo Database rồi query.
 * Nếu muốn học kỹ và chuẩn chỉnh đầy đủ hơn thì xem Playlist này nhé:
 * https://www.youtube.com/playlist?list=PLP6tw4Zpj-RIMgUPYxhLBVCpaBs94D73V
 */
const MOCK_DATABASE = {
  USER: {
    ID: 'khangn-id-12345678',
    EMAIL: 'khangn@gmail.com',
    PASSWORD: 'khangn@123',
  },
};

const login = async (req, res) => {
  try {
    // 1. Valid email and password
    if (
      req.body.email !== MOCK_DATABASE.USER.EMAIL ||
      req.body.password !== MOCK_DATABASE.USER.PASSWORD
    ) {
      res.status(StatusCodes.FORBIDDEN).json({ message: 'Your email or password is incorrect!' });
      return;
    }

    // Trường hợp nhập đúng thông tin tài khoản, tạo token và trả về cho phía Client
    // 2. Create userInfo
    const userInfo = {
      id: MOCK_DATABASE.USER.ID,
      email: MOCK_DATABASE.USER.EMAIL,
    };

    // 3. Generate access and refresh tokens
    const accessToken = await generateToken(
      userInfo,
      ACCESS_TOKEN_SECRET_SIGNATURE,
      ACCESS_TOKEN_EXPIRED,
    );
    const refreshToken = await generateToken(
      userInfo,
      REFRESH_TOKEN_SECRET_SIGNATURE,
      REFRESH_TOKEN_EXPIRED,
    );

    // 4. Return tokens for client by 2 approaches:
    // Approach 1: Server (Backend) storages tokens into Cookie (HttpOnlyCookie)
    // Approach 2: Return tokens for Client (Frontend) storage into Local Storage

    // Approach 1: HttpOnlyCookie
    // maxAge: The lifetime of Cookie (millisecond). It differs from the lifetime of token (expiresIn)
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days'),
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days'),
    });

    // Approach 2: Returns tokens in response to Client storage into Local Storage
    res.status(StatusCodes.OK).json({
      message: 'Login API success!',
      userInfo,
      tokens: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.status(StatusCodes.OK).json({ message: 'Logout API success!' });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const refreshToken = async (req, res) => {
  try {
    // Step 1: Get refresh token:
    // + Approach 1: Get refresh token from Cookie in request
    const refreshTokenFromCookie = req.cookies?.refreshToken;

    // + Approach 2: Get refresh token in request body (Client get refresh token from localStorage and attach into body request when call API)
    const refreshTokenFromBody = req.body?.refreshToken;

    // Step 2: Valid and verify refresh token
    // + Approach 1
    // if (!refreshTokenFromCookie) {
    //   res.status(StatusCodes.FORBIDDEN).json({ message: 'Please login' });
    //   return;
    // }

    // + Approach 2
    // if (!refreshTokenFromBody) {
    //   res.status(StatusCodes.FORBIDDEN).json({ message: 'Please login' });
    //   return;
    // }

    const refreshTokenDecoded = await verifyToken(
      // refreshTokenFromBody,
      refreshTokenFromCookie,
      REFRESH_TOKEN_SECRET_SIGNATURE,
    );

    // Step 3: Query to database to get user info or get from token decoded
    const userInfo = {
      id: refreshTokenDecoded.id,
      email: refreshTokenDecoded.email,
    };

    // Step 4: Generate new access token
    const newAccessToken = await generateToken(
      userInfo,
      ACCESS_TOKEN_SECRET_SIGNATURE,
      ACCESS_TOKEN_EXPIRED,
    );

    // Step 5 (Option): Set new access token into Cookie (Usage HttpOnly Cookie)
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days'),
    });

    // Step 6: Return new access token (Client can use it to update access token into LocalStorage)
    res
      .status(StatusCodes.OK)
      .json({ message: 'Refresh Token API success.', accessToken: newAccessToken });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Refresh Token API failed' });
  }
};

export const userController = {
  login,
  logout,
  refreshToken,
};
